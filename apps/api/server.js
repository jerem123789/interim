import Fastify from 'fastify';
import cors from '@fastify/cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});

// Enable CORS
await fastify.register(cors, {
  origin: true
});

// Load data
let data = { candidats: [], missions: [] };

try {
  const dataPath = path.join(__dirname, '../../data/candidats.json');
  const fileContent = await fs.readFile(dataPath, 'utf-8');
  data = JSON.parse(fileContent);
  console.log(`Loaded ${data.candidats.length} candidats and ${data.missions.length} missions`);
} catch (error) {
  console.error('Error loading data:', error);
}

// Routes

// Health check
fastify.get('/', async (request, reply) => {
  return { 
    status: 'ok', 
    service: 'Preselection Interim API',
    candidats: data.candidats.length,
    missions: data.missions.length
  };
});

// Get all candidats
fastify.get('/api/candidats', async (request, reply) => {
  return data.candidats;
});

// Get candidat by ID
fastify.get('/api/candidats/:id', async (request, reply) => {
  const candidat = data.candidats.find(c => c.id === request.params.id);
  if (!candidat) {
    reply.code(404).send({ error: 'Candidat not found' });
    return;
  }
  return candidat;
});

// Get all missions
fastify.get('/api/missions', async (request, reply) => {
  return data.missions;
});

// Get mission by ID
fastify.get('/api/missions/:id', async (request, reply) => {
  const mission = data.missions.find(m => m.id === request.params.id);
  if (!mission) {
    reply.code(404).send({ error: 'Mission not found' });
    return;
  }
  return mission;
});

// Calculate compatibility score
function calculateScore(candidat, mission) {
  let score = 0;
  let details = {};

  // Competences match (40 points)
  const candidatCompetences = candidat.competences.map(c => c.toLowerCase());
  const missionCompetences = mission.competencesRequises.map(c => c.toLowerCase());
  
  const matchingCompetences = missionCompetences.filter(mc => 
    candidatCompetences.some(cc => cc.includes(mc) || mc.includes(cc))
  );
  
  const competenceScore = (matchingCompetences.length / missionCompetences.length) * 40;
  score += competenceScore;
  details.competences = {
    score: Math.round(competenceScore),
    matching: matchingCompetences,
    required: missionCompetences,
    candidat: candidatCompetences
  };

  // Experience match (30 points)
  const experienceYears = candidat.experience.anneesTotal;
  const requiredExp = mission.experience;
  
  let experienceScore = 0;
  if (requiredExp.includes('-')) {
    const [min, max] = requiredExp.split('-').map(e => parseInt(e));
    if (experienceYears >= min && experienceYears <= max) {
      experienceScore = 30;
    } else if (experienceYears >= min) {
      experienceScore = 20;
    } else {
      experienceScore = 10;
    }
  }
  
  score += experienceScore;
  details.experience = {
    score: experienceScore,
    candidat: experienceYears,
    required: requiredExp
  };

  // Disponibilite (20 points)
  const candidatHoraires = candidat.disponibilite.horaires.map(h => h.toLowerCase());
  const missionHoraires = mission.horaires.map(h => h.toLowerCase());
  
  const matchingHoraires = missionHoraires.filter(mh => 
    candidatHoraires.includes(mh)
  );
  
  const disponibiliteScore = (matchingHoraires.length / missionHoraires.length) * 20;
  score += disponibiliteScore;
  details.disponibilite = {
    score: Math.round(disponibiliteScore),
    matching: matchingHoraires,
    required: missionHoraires,
    candidat: candidatHoraires
  };

  // Salary expectations (10 points)
  let salaryScore = 0;
  if (candidat.pretentionsSalariales.unite === mission.salaire.unite) {
    const candidatMax = candidat.pretentionsSalariales.max;
    const missionSalary = mission.salaire.taux;
    
    if (missionSalary >= candidatMax) {
      salaryScore = 10;
    } else if (missionSalary >= candidat.pretentionsSalariales.min) {
      salaryScore = 7;
    } else {
      salaryScore = 3;
    }
  }
  
  score += salaryScore;
  details.salaire = {
    score: salaryScore,
    candidatMin: candidat.pretentionsSalariales.min,
    candidatMax: candidat.pretentionsSalariales.max,
    mission: mission.salaire.taux,
    unite: mission.salaire.unite
  };

  return {
    score: Math.round(score),
    maxScore: 100,
    percentage: Math.round(score),
    details
  };
}

// Score candidat pour une mission
fastify.get('/api/score/:candidatId/:missionId', async (request, reply) => {
  const candidat = data.candidats.find(c => c.id === request.params.candidatId);
  const mission = data.missions.find(m => m.id === request.params.missionId);
  
  if (!candidat) {
    reply.code(404).send({ error: 'Candidat not found' });
    return;
  }
  
  if (!mission) {
    reply.code(404).send({ error: 'Mission not found' });
    return;
  }
  
  const result = calculateScore(candidat, mission);
  
  return {
    candidat: {
      id: candidat.id,
      nom: candidat.nom,
      prenom: candidat.prenom
    },
    mission: {
      id: mission.id,
      titre: mission.titre,
      entreprise: mission.entreprise
    },
    ...result
  };
});

// Get all scores for a mission
fastify.get('/api/mission/:missionId/candidats', async (request, reply) => {
  const mission = data.missions.find(m => m.id === request.params.missionId);
  
  if (!mission) {
    reply.code(404).send({ error: 'Mission not found' });
    return;
  }
  
  const scores = data.candidats.map(candidat => {
    const result = calculateScore(candidat, mission);
    return {
      candidat: {
        id: candidat.id,
        nom: candidat.nom,
        prenom: candidat.prenom,
        email: candidat.email,
        telephone: candidat.telephone
      },
      score: result.score,
      percentage: result.percentage
    };
  });
  
  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);
  
  return {
    mission: {
      id: mission.id,
      titre: mission.titre,
      entreprise: mission.entreprise
    },
    candidats: scores
  };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 4000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
