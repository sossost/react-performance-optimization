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

// 검색 API (실제 네트워크 요청을 보여주기 위해 posts API 사용)
export async function searchAPI(query: string): Promise<string[]> {
  // JSONPlaceholder는 검색 API가 없으므로 posts를 가져와서 클라이언트에서 필터링
  // 실제 네트워크 요청이 발생하도록 fetch 사용
  const response = await fetch(`${API_BASE}/posts`);
  if (!response.ok) {
    throw new Error("Failed to search");
  }
  const posts = await response.json();
  
  // 클라이언트 사이드에서 검색어로 필터링 (실제로는 서버에서 필터링하지만, 네트워크 요청은 발생)
  const filtered = posts
    .filter((post: any) => post.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);
  
  return filtered.map((post: any) => `"${query}"에 대한 결과: ${post.title}`);
}

