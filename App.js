import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { StatusBar } from "expo-status-bar";

const categories = ["Wszystkie", "Nauka", "Sport", "Muzyka", "Film"];
const bioLimit = 140;

const initialEvents = [
  {
    id: "1",
    title: "Warsztaty React Native",
    date: "24 maja 2026",
    category: "Nauka",
    location: "Katowice, sala A12",
    favorite: false,
    badge: "Nowe"
  },
  {
    id: "2",
    title: "Wieczorny turniej koszykowki",
    date: "27 maja 2026",
    category: "Sport",
    location: "Sosnowiec, hala MOSiR",
    favorite: true,
    badge: "Popularne"
  },
  {
    id: "3",
    title: "Koncert muzyki filmowej",
    date: "30 maja 2026",
    category: "Muzyka",
    location: "Chorzow, amfiteatr",
    favorite: false,
    badge: "Weekend"
  },
  {
    id: "4",
    title: "Maraton kina sci-fi",
    date: "2 czerwca 2026",
    category: "Film",
    location: "Katowice, Kino Centrum",
    favorite: false,
    badge: "Nocne"
  },
  {
    id: "5",
    title: "Hackathon aplikacji mobilnych",
    date: "6 czerwca 2026",
    category: "Nauka",
    location: "Gliwice, kampus IT",
    favorite: false,
    badge: "Nowe"
  },
  {
    id: "6",
    title: "Bieg po parku Slaskim",
    date: "9 czerwca 2026",
    category: "Sport",
    location: "Chorzow, Park Slaski",
    favorite: true,
    badge: "Outdoor"
  }
];

const lightTheme = {
  background: "#f4f7fb",
  surface: "#ffffff",
  surfaceSoft: "#e8edf5",
  border: "#d7deea",
  text: "#162033",
  muted: "#667085",
  primary: "#126c73",
  primarySoft: "#dff5f2",
  accent: "#b84f2f",
  success: "#247a45",
  danger: "#b42318"
};

const darkTheme = {
  background: "#111418",
  surface: "#1b2128",
  surfaceSoft: "#27313c",
  border: "#3b4654",
  text: "#f6f7fb",
  muted: "#b6c0cc",
  primary: "#6ed3c3",
  primarySoft: "#183f3b",
  accent: "#f0a15f",
  success: "#75c993",
  danger: "#ff9b8f"
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState("events");
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.app, { backgroundColor: theme.background }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <View style={[styles.topBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable
          onPress={() => setActiveScreen("events")}
          style={[
            styles.screenTab,
            activeScreen === "events" && { backgroundColor: theme.primary }
          ]}
        >
          <Text
            style={[
              styles.screenTabText,
              { color: activeScreen === "events" ? "#ffffff" : theme.text }
            ]}
          >
            Wydarzenia
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveScreen("profile")}
          style={[
            styles.screenTab,
            activeScreen === "profile" && { backgroundColor: theme.primary }
          ]}
        >
          <Text
            style={[
              styles.screenTabText,
              { color: activeScreen === "profile" ? "#ffffff" : theme.text }
            ]}
          >
            Profil
          </Text>
        </Pressable>
      </View>

      {activeScreen === "events" ? (
        <EventCatalog theme={theme} />
      ) : (
        <UserPanel
          theme={theme}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((value) => !value)}
        />
      )}
    </SafeAreaView>
  );
}

function EventCatalog({ theme }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Wszystkie");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [events, setEvents] = useState(initialEvents);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesText = event.title.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory = activeCategory === "Wszystkie" || event.category === activeCategory;
      const matchesFavorite = !onlyFavorites || event.favorite;

      return matchesText && matchesCategory && matchesFavorite;
    });
  }, [events, query, activeCategory, onlyFavorites]);

  const toggleFavorite = (id) => {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === id ? { ...event, favorite: !event.favorite } : event
      )
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: theme.primary }]}>Zadanie 1</Text>
        <Text style={[styles.heading, { color: theme.text }]}>Katalog wydarzen</Text>
        <Text style={[styles.lead, { color: theme.muted }]}>
          Lokalne spotkania, zajecia i wydarzenia z szybkim filtrowaniem.
        </Text>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Szukaj po nazwie"
        placeholderTextColor={theme.muted}
        style={[
          styles.input,
          { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }
        ]}
      />

      <View style={styles.filterRow}>
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <Pressable
              key={category}
              onPress={() => setActiveCategory(category)}
              style={[
                styles.filterChip,
                { backgroundColor: theme.surface, borderColor: theme.border },
                active && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
            >
              <Text style={[styles.filterText, { color: active ? "#ffffff" : theme.text }]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.resultCount, { color: theme.text }]}>
          Widoczne wyniki: {filteredEvents.length}
        </Text>
        <Pressable
          onPress={() => setOnlyFavorites((value) => !value)}
          style={[
            styles.favoriteToggle,
            { borderColor: theme.border, backgroundColor: theme.surface },
            onlyFavorites && { backgroundColor: theme.primarySoft, borderColor: theme.primary }
          ]}
        >
          <Text style={[styles.favoriteToggleText, { color: theme.text }]}>
            {onlyFavorites ? "Tylko ulubione" : "Wszystkie"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.listGap} />}
        ListEmptyComponent={() => (
          <View style={[styles.emptyBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Brak wydarzen</Text>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              Zmien filtr albo wpisz krotsza fraze.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            date={item.date}
            category={item.category}
            location={item.location}
            favorite={item.favorite}
            badge={item.badge}
            theme={theme}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.eventList}
      />
    </View>
  );
}

function EventCard({ title, date, category, location, favorite, badge, theme, onToggleFavorite }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.cardTopRow}>
        <View style={[styles.badge, { backgroundColor: theme.primarySoft }]}>
          <Text style={[styles.badgeText, { color: theme.primary }]}>{badge}</Text>
        </View>
        <Text style={[styles.category, { color: theme.accent }]}>{category}</Text>
      </View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.cardMeta, { color: theme.muted }]}>{date}</Text>
      <Text style={[styles.cardMeta, { color: theme.muted }]}>{location}</Text>
      <Pressable
        onPress={onToggleFavorite}
        style={[
          styles.cardButton,
          { backgroundColor: favorite ? theme.success : theme.primary }
        ]}
      >
        <Text style={styles.cardButtonText}>{favorite ? "Ulubione" : "Zapisz"}</Text>
      </Pressable>
    </View>
  );
}

function UserPanel({ theme, darkMode, onToggleTheme }) {
  const [profile, setProfile] = useState({
    name: "Wiktor",
    city: "Sosnowiec",
    email: "wiktor@example.com",
    bio: "Student informatyki, ktory testuje aplikacje mobilne w React Native."
  });
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    city: profile.city,
    bio: profile.bio,
    password: ""
  });
  const [notifications, setNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!message.text || message.type === "error") return undefined;

    const timer = setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 2500);

    return () => clearTimeout(timer);
  }, [message]);

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const saveProfile = () => {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedCity = form.city.trim();
    const trimmedBio = form.bio.trim();

    if (!trimmedName) {
      setMessage({ type: "error", text: "Imie nie moze byc puste." });
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setMessage({ type: "error", text: "E-mail musi zawierac znak @." });
      return;
    }

    if (trimmedBio.length > bioLimit) {
      setMessage({ type: "error", text: `Bio moze miec maksymalnie ${bioLimit} znakow.` });
      return;
    }

    setProfile({
      name: trimmedName,
      email: trimmedEmail,
      city: trimmedCity || "Brak miasta",
      bio: trimmedBio
    });
    setMessage({ type: "success", text: "Zapisano zmiany w profilu." });
  };

  const logout = () => {
    setMessage({ type: "success", text: "Sesja zostala zakonczona." });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.profileContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: theme.primary }]}>Zadanie 2</Text>
        <Text style={[styles.heading, { color: theme.text }]}>Panel uzytkownika</Text>
        <Text style={[styles.lead, { color: theme.muted }]}>
          Profil, formularz edycji danych i ustawienia konta.
        </Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80" }}
          resizeMode="cover"
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]}>{profile.name}</Text>
          <Text style={[styles.profileCity, { color: theme.muted }]}>{profile.city}</Text>
          <Text style={[styles.profileBio, { color: theme.text }]}>{profile.bio}</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Edycja danych</Text>
        <LabeledInput
          label="Imie"
          value={form.name}
          onChangeText={(text) => updateField("name", text)}
          theme={theme}
        />
        <LabeledInput
          label="E-mail"
          value={form.email}
          onChangeText={(text) => updateField("email", text)}
          keyboardType="email-address"
          theme={theme}
        />
        <LabeledInput
          label="Miasto"
          value={form.city}
          onChangeText={(text) => updateField("city", text)}
          theme={theme}
        />
        <LabeledInput
          label="Bio"
          value={form.bio}
          onChangeText={(text) => updateField("bio", text)}
          multiline
          theme={theme}
        />
        <Text
          style={[
            styles.counter,
            { color: form.bio.length > bioLimit ? theme.danger : theme.muted }
          ]}
        >
          {form.bio.length}/{bioLimit}
        </Text>
        <View style={styles.passwordRow}>
          <View style={styles.passwordInputWrap}>
            <LabeledInput
              label="Haslo"
              value={form.password}
              onChangeText={(text) => updateField("password", text)}
              secureTextEntry={!showPassword}
              theme={theme}
            />
          </View>
          <Pressable
            onPress={() => setShowPassword((value) => !value)}
            style={[styles.smallButton, { borderColor: theme.border }]}
          >
            <Text style={[styles.smallButtonText, { color: theme.text }]}>
              {showPassword ? "Ukryj" : "Pokaz"}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={saveProfile} style={[styles.saveButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
        </Pressable>

        {message.text ? (
          <View
            style={[
              styles.messageBox,
              {
                borderColor: message.type === "error" ? theme.danger : theme.success,
                backgroundColor: message.type === "error" ? "#fff1f0" : "#edf9f1"
              }
            ]}
          >
            <Text
              style={[
                styles.messageText,
                { color: message.type === "error" ? theme.danger : theme.success }
              ]}
            >
              {message.text}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Ustawienia</Text>
        <SettingsRow
          title="Powiadomienia"
          value={notifications ? "Wlaczone" : "Wylaczone"}
          active={notifications}
          theme={theme}
          onPress={() => setNotifications((value) => !value)}
        />
        <SettingsRow
          title="Prywatnosc"
          value={privateProfile ? "Profil prywatny" : "Profil publiczny"}
          active={privateProfile}
          theme={theme}
          onPress={() => setPrivateProfile((value) => !value)}
        />
        <SettingsRow
          title="Ciemny motyw"
          value={darkMode ? "Aktywny" : "Nieaktywny"}
          active={darkMode}
          theme={theme}
          onPress={onToggleTheme}
        />
        <SettingsRow
          title="O aplikacji"
          value="Projekt RN"
          active={false}
          theme={theme}
          onPress={() => setMessage({ type: "success", text: "React Native Expo: zadania projektowe." })}
        />
      </View>

      <View style={[styles.logoutSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable onPress={logout} style={[styles.logoutButton, { backgroundColor: theme.danger }]}>
          <Text style={styles.logoutText}>Wyloguj</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function LabeledInput({ label, theme, multiline = false, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.muted}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.textArea,
          { backgroundColor: theme.surfaceSoft, borderColor: theme.border, color: theme.text }
        ]}
        {...inputProps}
      />
    </View>
  );
}

function SettingsRow({ title, value, active, theme, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.settingsRow, { borderColor: theme.border }]}
    >
      <View>
        <Text style={[styles.settingsTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.settingsValue, { color: theme.muted }]}>{value}</Text>
      </View>
      <View
        style={[
          styles.switchTrack,
          { backgroundColor: active ? theme.primary : theme.surfaceSoft }
        ]}
      >
        <View
          style={[
            styles.switchThumb,
            active && styles.switchThumbActive
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1
  },
  topBar: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 6,
    borderWidth: 1,
    borderRadius: 8
  },
  screenTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: 6
  },
  screenTabText: {
    fontSize: 14,
    fontWeight: "700"
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16
  },
  header: {
    paddingTop: 22,
    paddingBottom: 14
  },
  kicker: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heading: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "800"
  },
  lead: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  filterChip: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700"
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
    marginBottom: 10
  },
  resultCount: {
    fontSize: 15,
    fontWeight: "800"
  },
  favoriteToggle: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  favoriteToggleText: {
    fontSize: 13,
    fontWeight: "800"
  },
  eventList: {
    paddingBottom: 24
  },
  listGap: {
    height: 12
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800"
  },
  category: {
    fontSize: 13,
    fontWeight: "800"
  },
  cardTitle: {
    marginTop: 12,
    fontSize: 19,
    fontWeight: "800"
  },
  cardMeta: {
    marginTop: 5,
    fontSize: 14
  },
  cardButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    marginTop: 14,
    borderRadius: 8
  },
  cardButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800"
  },
  emptyBox: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    padding: 20
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800"
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14
  },
  profileContent: {
    paddingBottom: 28
  },
  profileCard: {
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 14
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 8
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 22,
    fontWeight: "800"
  },
  profileCity: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700"
  },
  profileBio: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20
  },
  section: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 12
  },
  field: {
    marginBottom: 11
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "800"
  },
  textArea: {
    minHeight: 92,
    textAlignVertical: "top"
  },
  counter: {
    alignSelf: "flex-end",
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "700"
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10
  },
  passwordInputWrap: {
    flex: 1
  },
  smallButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    minWidth: 72,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 11
  },
  smallButtonText: {
    fontSize: 13,
    fontWeight: "800"
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderRadius: 8,
    marginTop: 2
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800"
  },
  messageBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12
  },
  messageText: {
    fontSize: 14,
    fontWeight: "800"
  },
  settingsRow: {
    minHeight: 64,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: "800"
  },
  settingsValue: {
    marginTop: 3,
    fontSize: 13
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ffffff"
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }]
  },
  logoutSection: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16
  },
  logoutButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderRadius: 8
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800"
  }
});
