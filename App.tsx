import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, View, Button, ScrollView } from "react-native";
import type { CandidateForm } from "@interim/shared";

const API_URL = "http://localhost:4000";

const emptyForm: CandidateForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  distanceKm: 0,
  availability: "immediate",
  experienceYears: 0,
  hasVehicle: false,
  licenses: [],
  certifications: [],
  languages: ["Francais"],
  desiredRate: 12,
  notes: ""
};

export default function App() {
  const [form, setForm] = useState<CandidateForm>(emptyForm);
  const [result, setResult] = useState<string>("");

  const submit = async () => {
    const res = await fetch(`${API_URL}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setResult(`Score: ${data.score} / Statut: ${data.status}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Preselection Interim</Text>
        <TextInput
          placeholder="Prenom"
          value={form.firstName}
          onChangeText={(v) => setForm({ ...form, firstName: v })}
          style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
        />
        <TextInput
          placeholder="Nom"
          value={form.lastName}
          onChangeText={(v) => setForm({ ...form, lastName: v })}
          style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
        />
        <TextInput
          placeholder="Email"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
        />
        <TextInput
          placeholder="Telephone"
          value={form.phone}
          onChangeText={(v) => setForm({ ...form, phone: v })}
          style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
        />
        <TextInput
          placeholder="Ville"
          value={form.city}
          onChangeText={(v) => setForm({ ...form, city: v })}
          style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
        />
        <View style={{ marginTop: 8 }}>
          <Button title="Evaluer" onPress={submit} />
        </View>
        {result ? <Text>{result}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
