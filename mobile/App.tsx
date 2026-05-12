import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const roles = [
  { name: "Teacher", text: "Attendance, sessions, notes", color: "#16a34a" },
  { name: "Parent", text: "Updates, payments, progress", color: "#f97316" },
  { name: "Student", text: "Lessons, projects, badges", color: "#ec4899" },
  { name: "Admin", text: "Programs, users, reports", color: "#2563eb" },
];

const programs = [
  { name: "Robotics Basics", grade: "Grade 3-5", students: 24 },
  { name: "AI Explorers", grade: "Grade 6-8", students: 28 },
  { name: "Cricket Academy", grade: "Age 8-14", students: 20 },
];

function BrandMark() {
  return (
    <View style={styles.brandRow}>
      <View style={styles.mark}>
        <View style={[styles.markBlock, { backgroundColor: "#f97316" }]} />
        <View style={[styles.markBlock, { backgroundColor: "#2563eb" }]} />
        <View style={[styles.markBlock, { backgroundColor: "#7c3aed" }]} />
        <View style={[styles.markBlock, { backgroundColor: "#10b981" }]} />
      </View>
      <View>
        <Text style={styles.brand}>INIAC</Text>
        <Text style={styles.tagline}>Learn - Build - Compete</Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <BrandMark />

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>React Native app</Text>
          <Text style={styles.title}>School activity platform for iOS and Android</Text>
          <Text style={styles.subtitle}>
            Mobile-first flows for teachers, parents, students, and admins.
          </Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Start demo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Today sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Pending notes</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select role</Text>
        <View style={styles.roleList}>
          {roles.map((role) => (
            <TouchableOpacity key={role.name} style={styles.roleCard}>
              <View style={[styles.roleIcon, { backgroundColor: role.color }]} />
              <View style={styles.roleText}>
                <Text style={styles.roleName}>{role.name}</Text>
                <Text style={styles.roleDetail}>{role.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Programs</Text>
        <View style={styles.programList}>
          {programs.map((program) => (
            <View key={program.name} style={styles.programCard}>
              <View>
                <Text style={styles.programName}>{program.name}</Text>
                <Text style={styles.programMeta}>{program.grade}</Text>
              </View>
              <Text style={styles.programCount}>{program.students} students</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  mark: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    height: 44,
    padding: 5,
    width: 44,
  },
  markBlock: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  brand: {
    color: "#0f172a",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
  },
  tagline: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
  },
  hero: {
    backgroundColor: "#fff",
    borderRadius: 28,
    marginTop: 28,
    padding: 24,
  },
  eyebrow: {
    color: "#6d28d9",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: "#0f172a",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
    marginTop: 12,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#6d28d9",
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    marginTop: 22,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    flex: 1,
    padding: 14,
  },
  statValue: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "900",
  },
  statLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 28,
  },
  roleList: {
    gap: 12,
    marginTop: 14,
  },
  roleCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    gap: 14,
    padding: 16,
  },
  roleIcon: {
    borderRadius: 14,
    height: 42,
    width: 42,
  },
  roleText: {
    flex: 1,
  },
  roleName: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "900",
  },
  roleDetail: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 3,
  },
  programList: {
    gap: 12,
    marginTop: 14,
  },
  programCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  programName: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
  },
  programMeta: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 4,
  },
  programCount: {
    color: "#6d28d9",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 12,
  },
});
