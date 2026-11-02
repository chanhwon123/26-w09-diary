
import { useCallback, useEffect, useMemo, useState } from "react";
import { addDiary, deleteDiary, getDiaries } from "./api/diaries";

const emotions = [
  { id: "joy", emoji: "😊", label: "기쁨" },
  { id: "calm", emoji: "😌", label: "평온" },
  { id: "sad", emoji: "😢", label: "슬픔" },
  { id: "angry", emoji: "😠", label: "화남" },
  { id: "anxious", emoji: "😰", label: "불안" },
];

function getEmotion(id) {
  return emotions.find((e) => e.id === id) || emotions[0];
}

function formatDate(date) {
  return new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [diaries, setDiaries] = useState([]);
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState("joy");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDiaries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDiaries();
      setDiaries(data);
    } catch (err) {
      console.error(err);
      setError("일기를 불러오지 못했습니다. Supabase 설정을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiaries();
  }, [loadDiaries]);

  const filteredDiaries = useMemo(() => {
    if (filter === "all") return diaries;
    return diaries.filter((diary) => diary.emotion === filter);
  }, [diaries, filter]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      await addDiary({
        content: content.trim(),
        emotion,
      });

      setContent("");
      await loadDiaries();
    } catch (err) {
      console.error(err);
      setError("저장 실패! Supabase 설정과 네트워크를 확인해주세요.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("이 일기를 삭제할까요?")) return;

    try {
      await deleteDiary(id);
      await loadDiaries();
    } catch (err) {
      console.error(err);
      setError("삭제에 실패했습니다.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        <header className="mb-8 text-center">
          <div className="mb-3 text-5xl">🌷</div>
          <p className="text-sm font-bold tracking-widest text-violet-500">
            MY LITTLE MOMENT
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-800">
            감정 일기
          </h1>
          <p className="mt-3 text-slate-500">
            오늘의 마음을 천천히 기록해보세요.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-5 text-xl font-bold text-slate-800">
            오늘은 어떤 기분인가요?
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-5 grid grid-cols-5 gap-2">
              {emotions.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setEmotion(item.id)}
                  className={`rounded-2xl border-2 p-3 transition ${
                    emotion === item.id
                      ? "border-violet-400 bg-violet-100"
                      : "border-transparent bg-slate-50"
                  }`}
                >
                  <div className="text-2xl">{item.emoji}</div>
                  <div className="mt-2 text-xs font-semibold">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 있었던 일과 감정을 적어보세요..."
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-violet-400"
            />

            <div className="mt-4 flex justify-between">
              <span className="text-xs text-slate-400">
                {content.length}자
              </span>

              <button
                type="submit"
                disabled={saving || !content.trim()}
                className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
              >
                {saving ? "저장 중..." : "일기 저장하기 ✨"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">나의 기록</h2>
              <p className="text-sm text-slate-500">
                총 {diaries.length}개의 일기
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-full px-3 py-2 text-sm ${
                  filter === "all"
                    ? "bg-violet-600 text-white"
                    : "bg-white"
                }`}
              >
                전체
              </button>

              {emotions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full px-3 py-2 text-sm ${
                    filter === item.id
                      ? "bg-violet-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {item.emoji} {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              불러오는 중...
            </div>
          ) : filteredDiaries.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
              아직 작성된 일기가 없어요. 첫 일기를 작성해보세요! 📔
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDiaries.map((diary) => {
                const item = getEmotion(diary.emotion);

                return (
                  <article
                    key={diary.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <span className="text-2xl">
                          {item.emoji}
                        </span>
                        <span className="ml-2 font-semibold">
                          {item.label}
                        </span>
                        <p className="mt-2 text-xs text-slate-400">
                          {formatDate(diary.created_at)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(diary.id)}
                        className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                      >
                        삭제
                      </button>
                    </div>

                    <p className="whitespace-pre-wrap break-words leading-7 text-slate-700">
                      {diary.content}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="mt-10 text-center text-sm text-slate-400">
          당신의 모든 감정은 소중해요 💜
        </footer>
      </div>
    </main>
  );
}
