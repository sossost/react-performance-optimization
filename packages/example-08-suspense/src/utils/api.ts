// 실제 API 호출 함수들 (JSONPlaceholder 사용)

const API_BASE = "https://jsonplaceholder.typicode.com";

// 사용자 정보 가져오기
export async function fetchUser(userId: number) {
  const response = await fetch(`${API_BASE}/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

// 게시글 가져오기
export async function fetchPosts(userId: number) {
  const response = await fetch(`${API_BASE}/posts?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

// 댓글 가져오기
export async function fetchComments(postId: number) {
  const response = await fetch(`${API_BASE}/comments?postId=${postId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
}

