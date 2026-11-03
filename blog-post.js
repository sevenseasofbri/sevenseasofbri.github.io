// Preserve bookmarks to the original JSON-based post viewer.
const postId = new URLSearchParams(window.location.search).get("id");
if (postId && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(postId)) {
    window.location.replace(`blog-posts/${postId}.html${window.location.hash}`);
}
