import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
const postsEndpoint = "https://jsonplaceholder.typicode.com/posts";

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
        <Pressable
          onPress={() => setActiveScreen("api")}
          style={[
            styles.screenTab,
            activeScreen === "api" && { backgroundColor: theme.primary }
          ]}
        >
          <Text
            style={[
              styles.screenTabText,
              { color: activeScreen === "api" ? "#ffffff" : theme.text }
            ]}
          >
            API
          </Text>
        </Pressable>
      </View>

      {activeScreen === "events" ? (
        <EventCatalog theme={theme} />
      ) : activeScreen === "profile" ? (
        <UserPanel
          theme={theme}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((value) => !value)}
        />
      ) : (
        <ApiPostsScreen theme={theme} />
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

function ApiPostsScreen({ theme }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState("");
  const [createdPost, setCreatedPost] = useState(null);
  const [userFilter, setUserFilter] = useState("");
  const [form, setForm] = useState({
    title: "Nowy post z aplikacji Expo",
    body: "To jest test wysylania danych JSON metoda POST.",
    userId: "7"
  });

  const fetchPosts = async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(postsEndpoint, { signal });

      if (!response.ok) {
        throw new Error(`Blad HTTP przy pobieraniu: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (requestError) {
      if (requestError.name === "AbortError") return;
      setError(requestError.message || "Nie udalo sie pobrac postow.");
    } finally {
      if (signal?.aborted) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchPosts(controller.signal);

    return () => controller.abort();
  }, []);

  const updatePostField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const createPost = async () => {
    const title = form.title.trim();
    const body = form.body.trim();
    const userId = Number(form.userId);

    setSuccess("");
    setError("");

    if (!title || !body || !form.userId.trim()) {
      setError("Uzupelnij pola title, body i userId.");
      return;
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      setError("userId musi byc dodatnia liczba calkowita.");
      return;
    }

    try {
      setPosting(true);

      const response = await fetch(postsEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          body,
          userId
        })
      });

      if (!response.ok) {
        throw new Error(`Blad HTTP przy zapisie: ${response.status}`);
      }

      const data = await response.json();
      setCreatedPost(data);
      setPosts((currentPosts) => [data, ...currentPosts]);
      setForm({ title: "", body: "", userId: "" });
      setSuccess("Post zostal wyslany. API testowe zwrocilo odpowiedz serwera.");
    } catch (requestError) {
      setError(requestError.message || "Nie udalo sie wyslac posta.");
    } finally {
      setPosting(false);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!userFilter.trim()) return posts;

    return posts.filter((post) => String(post.userId) === userFilter.trim());
  }, [posts, userFilter]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={styles.listGap} />}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={[styles.kicker, { color: theme.primary }]}>Zadanie 3</Text>
              <Text style={[styles.heading, { color: theme.text }]}>Posty z REST API</Text>
              <Text style={[styles.lead, { color: theme.muted }]}>
                GET i POST dla /posts, JSON, loading, error oraz lista FlatList.
              </Text>
              <Text style={[styles.authorLine, { color: theme.muted }]}>
                Autor: Wiktor Gałązka
              </Text>
            </View>

            <View style={[styles.apiPanel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.apiRow}>
                <View style={styles.apiTextBlock}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Pobieranie danych</Text>
                  <Text style={[styles.apiEndpoint, { color: theme.muted }]}>
                    GET {postsEndpoint}
                  </Text>
                </View>
                <Pressable
                  onPress={() => fetchPosts()}
                  disabled={loading}
                  style={[
                    styles.reloadButton,
                    { backgroundColor: loading ? theme.surfaceSoft : theme.primary }
                  ]}
                >
                  <Text style={styles.reloadButtonText}>Odswiez</Text>
                </Pressable>
              </View>

              {loading ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator color={theme.primary} />
                  <Text style={[styles.loadingText, { color: theme.muted }]}>Ladowanie danych...</Text>
                </View>
              ) : (
                <Text style={[styles.resultCount, { color: theme.text }]}>
                  Liczba rekordow: {filteredPosts.length}
                </Text>
              )}

              <TextInput
                value={userFilter}
                onChangeText={setUserFilter}
                placeholder="Rozszerzenie: filtruj po userId"
                placeholderTextColor={theme.muted}
                keyboardType="numeric"
                style={[
                  styles.input,
                  styles.apiFilterInput,
                  { backgroundColor: theme.surfaceSoft, borderColor: theme.border, color: theme.text }
                ]}
              />
            </View>

            <View style={[styles.apiPanel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Nowy post</Text>
              <Text style={[styles.apiEndpoint, { color: theme.muted }]}>
                POST {postsEndpoint}
              </Text>
              <LabeledInput
                label="title"
                value={form.title}
                onChangeText={(text) => updatePostField("title", text)}
                theme={theme}
              />
              <LabeledInput
                label="body"
                value={form.body}
                onChangeText={(text) => updatePostField("body", text)}
                multiline
                theme={theme}
              />
              <LabeledInput
                label="userId"
                value={form.userId}
                onChangeText={(text) => updatePostField("userId", text)}
                keyboardType="numeric"
                theme={theme}
              />
              <Pressable
                onPress={createPost}
                disabled={posting}
                style={[
                  styles.saveButton,
                  { backgroundColor: posting ? theme.surfaceSoft : theme.primary }
                ]}
              >
                <Text style={styles.saveButtonText}>
                  {posting ? "Wysylanie..." : "Wyslij"}
                </Text>
              </Pressable>

              {error ? (
                <View style={[styles.messageBox, { borderColor: theme.danger, backgroundColor: "#fff1f0" }]}>
                  <Text style={[styles.messageText, { color: theme.danger }]}>{error}</Text>
                </View>
              ) : null}

              {success ? (
                <View style={[styles.messageBox, { borderColor: theme.success, backgroundColor: "#edf9f1" }]}>
                  <Text style={[styles.messageText, { color: theme.success }]}>{success}</Text>
                </View>
              ) : null}

              {createdPost ? (
                <View style={[styles.responseBox, { backgroundColor: theme.surfaceSoft, borderColor: theme.border }]}>
                  <Text style={[styles.responseTitle, { color: theme.text }]}>Odpowiedz serwera</Text>
                  <Text style={[styles.responseText, { color: theme.muted }]}>
                    id: {createdPost.id} | userId: {createdPost.userId}
                  </Text>
                  <Text style={[styles.responseText, { color: theme.text }]}>
                    {createdPost.title}
                  </Text>
                  <Text style={[styles.responseText, { color: theme.muted }]}>
                    {createdPost.body}
                  </Text>
                </View>
              ) : null}

              <Text style={[styles.listTitle, { color: theme.text }]}>Lista postow</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Brak postow</Text>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                Zmien filtr albo sprobuj odswiezyc dane.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => <PostCard post={item} theme={theme} />}
        contentContainerStyle={styles.apiList}
      />
    </View>
  );
}

function PostCard({ post, theme }) {
  return (
    <View style={[styles.postCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.cardTopRow}>
        <Text style={[styles.postId, { color: theme.primary }]}>#{post.id}</Text>
        <Text style={[styles.cardMeta, { color: theme.muted }]}>userId: {post.userId}</Text>
      </View>
      <Text style={[styles.cardTitle, { color: theme.text }]}>{post.title}</Text>
      <Text style={[styles.postBody, { color: theme.muted }]}>{post.body}</Text>
    </View>
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
  authorLine: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "800"
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
  apiList: {
    paddingBottom: 28
  },
  apiPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 14
  },
  apiRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  apiTextBlock: {
    flex: 1
  },
  apiEndpoint: {
    marginBottom: 12,
    fontSize: 12,
    fontWeight: "700"
  },
  apiFilterInput: {
    marginTop: 12
  },
  reloadButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    minWidth: 88,
    borderRadius: 8,
    paddingHorizontal: 12
  },
  reloadButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800"
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 34
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "700"
  },
  responseBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12
  },
  responseTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6
  },
  responseText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18
  },
  listTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800"
  },
  postCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16
  },
  postId: {
    fontSize: 14,
    fontWeight: "900"
  },
  postBody: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20
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
