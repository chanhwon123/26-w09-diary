
import { supabase } from "../lib/supabase";

// 일기 조회: 최신순
export async function getDiaries() {
  const { data, error } = await supabase
    .from("diaries")
    .select("id, content, emotion, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// 일기 추가
export async function addDiary({ content, emotion }) {
  const { error } = await supabase
    .from("diaries")
    .insert([{ content, emotion }]);

  if (error) throw error;
}

// 일기 삭제
export async function deleteDiary(id) {
  const { error } = await supabase
    .from("diaries")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
