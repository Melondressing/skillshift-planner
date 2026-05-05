import React, { useMemo, useState } from "react";
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import sampleState from "./src/sampleState.json";
import { colors, radius, spacing } from "./src/theme";

const LIVE_SITE_URL = "https://melondressing.github.io/skillshift-planner/";

function money(currency, value) {
  const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  });
  return `${currency}${formatter.format(Number(value) || 0)}`;
}

function partName(id) {
  return sampleState.parts.find((part) => part.id === id)?.name || "Unknown";
}

function stationName(id) {
  return (
    sampleState.stations.find((station) => station.id === id)?.name || "Unknown"
  );
}

function skillName(id) {
  return sampleState.skills.find((skill) => skill.id === id)?.name || "Unknown";
}

function countSeats(requirements) {
  return requirements.reduce(
    (sum, req) =>
      sum +
      (req.stationRequirements || []).reduce(
        (seatSum, seat) => seatSum + Number(seat.requiredCount || 1),
        0,
      ),
    0,
  );
}

function uniqueStations(requirements) {
  const stations = new Set();
  requirements.forEach((req) => {
    (req.stationRequirements || []).forEach((seat) =>
      stations.add(`${seat.partId}:${seat.stationId}`),
    );
  });
  return stations.size;
}

function MetricCard({ label, value, note, tone = "accent" }) {
  return (
    <View
      style={[
        styles.metricCard,
        tone === "good" && styles.metricGood,
        tone === "warn" && styles.metricWarn,
        tone === "danger" && styles.metricDanger,
      ]}
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {note ? <Text style={styles.metricNote}>{note}</Text> : null}
    </View>
  );
}

function Pill({ children, tone = "neutral" }) {
  return (
    <View
      style={[
        styles.pill,
        tone === "accent" && styles.pillAccent,
        tone === "good" && styles.pillGood,
        tone === "warn" && styles.pillWarn,
        tone === "danger" && styles.pillDanger,
      ]}
    >
      <Text style={styles.pillText}>{children}</Text>
    </View>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export default function App() {
  const [view, setView] = useState("dashboard");

  const stats = useMemo(() => {
    const requirements = sampleState.requirements || [];
    const seatCount = countSeats(requirements);
    const activeParts = sampleState.parts.filter(
      (part) => part.active !== false,
    ).length;
    const totalSkills = sampleState.skills.length;
    const totalEmployees = sampleState.employees.length;
    const totalStations = sampleState.stations.length;
    const laborBudget = sampleState.settings?.laborBudget || 0;
    return {
      activeParts,
      totalSkills,
      totalEmployees,
      totalStations,
      seatCount,
      laborBudget,
      uniqueStations: uniqueStations(requirements),
    };
  }, []);

  const weekLabel = sampleState.settings?.weekLabel || "Sample Week";
  const currency = sampleState.settings?.currency || "$";
  const sortedRequirements = [...(sampleState.requirements || [])].sort(
    (a, b) => {
      const dayOrder = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      return (
        dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek) ||
        a.startTime.localeCompare(b.startTime)
      );
    },
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.hero}>
          <Text style={styles.kicker}>Cross-platform roster planning</Text>
          <Text style={styles.title}>SkillShift Planner</Text>
          <Text style={styles.heroText}>
            Part, Station, Skill level, and labor cost in one planner. This
            mobile shell is ready for iPhone, iPad, Android, and web.
          </Text>
          <View style={styles.heroActions}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => Linking.openURL(LIVE_SITE_URL)}
            >
              <Text style={styles.primaryButtonText}>Open web app</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => setView("dashboard")}
            >
              <Text style={styles.secondaryButtonText}>Dashboard</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.segmented}>
          {["dashboard", "team", "schedule"].map((item) => (
            <Pressable
              key={item}
              style={[styles.segment, view === item && styles.segmentActive]}
              onPress={() => setView(item)}
            >
              <Text
                style={[
                  styles.segmentText,
                  view === item && styles.segmentTextActive,
                ]}
              >
                {item === "dashboard"
                  ? "Dashboard"
                  : item === "team"
                    ? "Team"
                    : "Schedule"}
              </Text>
            </Pressable>
          ))}
        </View>

        {view === "dashboard" && (
          <View style={styles.stack}>
            <View style={styles.grid}>
              <MetricCard
                label="Parts"
                value={stats.activeParts}
                note="Active groups"
              />
              <MetricCard
                label="Stations"
                value={stats.totalStations}
                note="Work locations"
              />
              <MetricCard
                label="Skills"
                value={stats.totalSkills}
                note="Capabilities"
              />
              <MetricCard
                label="Employees"
                value={stats.totalEmployees}
                note="Loaded sample team"
              />
              <MetricCard
                label="Required seats"
                value={stats.seatCount}
                note="All time blocks"
                tone="warn"
              />
              <MetricCard
                label="Budget"
                value={money(currency, stats.laborBudget)}
                note={weekLabel}
                tone="good"
              />
            </View>

            <View style={styles.card}>
              <SectionTitle
                title="Live snapshot"
                subtitle={`Unique station placements in the sample week: ${stats.uniqueStations}`}
              />
              <View style={styles.rowWrap}>
                {sampleState.parts
                  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                  .map((part) => (
                    <Pill key={part.id} tone="accent">
                      {part.name}
                    </Pill>
                  ))}
              </View>
            </View>

            <View style={styles.card}>
              <SectionTitle
                title="Quick roadmap"
                subtitle="What this foundation is ready for next"
              />
              <View style={styles.list}>
                <Text style={styles.listItem}>
                  • Wire the same state model into editable forms.
                </Text>
                <Text style={styles.listItem}>
                  • Add local persistence for draft schedules.
                </Text>
                <Text style={styles.listItem}>
                  • Split managers and crew into separate views.
                </Text>
                <Text style={styles.listItem}>
                  • Add push notifications or calendar export later.
                </Text>
              </View>
            </View>
          </View>
        )}

        {view === "team" && (
          <View style={styles.stack}>
            <SectionTitle
              title="Team"
              subtitle="People, parts, and rates from the sample roster."
            />
            {sampleState.employees.map((employee) => (
              <View key={employee.id} style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={styles.cardTitle}>{employee.name}</Text>
                    <Text style={styles.cardSubtitle}>
                      {partName(employee.partId)} · {employee.role}
                    </Text>
                  </View>
                  <Pill tone="good">
                    {money(currency, employee.baseRate)}/h
                  </Pill>
                </View>
                <Text style={styles.cardBody}>
                  Max {employee.maxWeeklyHours}h per week. Preferred:{" "}
                  {employee.preferredWeeklyHours || "n/a"}h.
                </Text>
                <View style={styles.rowWrap}>
                  {Object.entries(employee.assignedSkills || {}).map(
                    ([skillId, assignment]) => (
                      <Pill key={skillId} tone="accent">
                        {skillName(skillId)} L{assignment.level}-S
                        {assignment.step}
                      </Pill>
                    ),
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {view === "schedule" && (
          <View style={styles.stack}>
            <SectionTitle
              title="Schedule preview"
              subtitle="Requirement blocks and station demand from the sample week."
            />
            {sortedRequirements.map((req) => (
              <View key={req.id} style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={styles.cardTitle}>{req.label}</Text>
                    <Text style={styles.cardSubtitle}>
                      {req.dayOfWeek.toUpperCase()} · {req.startTime}–
                      {req.endTime}
                    </Text>
                  </View>
                  <Pill tone={req.isPeak ? "danger" : "warn"}>
                    {req.isPeak ? "Peak" : "Normal"}
                  </Pill>
                </View>
                <View style={styles.list}>
                  {(req.stationRequirements || []).map((seat) => (
                    <Text key={seat.id} style={styles.listItem}>
                      • {partName(seat.partId)} / {stationName(seat.stationId)}{" "}
                      · Min L{seat.minLevel}-S{seat.minStep} · x
                      {seat.requiredCount || 1}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Next build step</Text>
          <Text style={styles.footerText}>
            Connect editing, local storage, and sync logic so this shell becomes
            the shared mobile front-end for the planner.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    backgroundColor: colors.background,
    position: "relative",
  },
  glowOne: {
    position: "absolute",
    top: -70,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(96, 165, 250, 0.20)",
  },
  glowTwo: {
    position: "absolute",
    top: 120,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: "rgba(52, 211, 153, 0.14)",
  },
  hero: {
    backgroundColor: colors.panel,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  kicker: {
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  heroText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: "900",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: "800",
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 999,
    padding: 4,
    backgroundColor: colors.panelSoft,
    marginBottom: spacing.md,
    gap: 4,
  },
  segment: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: colors.background,
  },
  segmentText: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 13,
  },
  segmentTextActive: {
    color: colors.text,
  },
  stack: {
    gap: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  metricCard: {
    width: "48%",
    minWidth: 150,
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  metricGood: {
    backgroundColor: "rgba(52, 211, 153, 0.10)",
  },
  metricWarn: {
    backgroundColor: "rgba(251, 191, 36, 0.10)",
  },
  metricDanger: {
    backgroundColor: "rgba(251, 113, 133, 0.10)",
  },
  metricLabel: {
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "800",
    fontSize: 11,
    marginBottom: 8,
  },
  metricValue: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.6,
    marginBottom: 2,
  },
  metricNote: {
    color: colors.muted,
    fontSize: 12,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  sectionHeader: {
    gap: 4,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panelSoft,
  },
  pillAccent: {
    backgroundColor: colors.accentSoft,
    borderColor: "rgba(96, 165, 250, 0.25)",
  },
  pillGood: {
    backgroundColor: "rgba(52, 211, 153, 0.14)",
    borderColor: "rgba(52, 211, 153, 0.22)",
  },
  pillWarn: {
    backgroundColor: "rgba(251, 191, 36, 0.14)",
    borderColor: "rgba(251, 191, 36, 0.24)",
  },
  pillDanger: {
    backgroundColor: "rgba(251, 113, 133, 0.14)",
    borderColor: "rgba(251, 113, 133, 0.24)",
  },
  pillText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 2,
  },
  cardSubtitle: {
    color: colors.muted,
    fontSize: 13,
  },
  cardBody: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  list: {
    gap: 6,
  },
  listItem: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  footerCard: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  footerTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  footerText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});
