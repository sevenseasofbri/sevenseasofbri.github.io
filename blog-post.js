const blogPostContainer = document.getElementById("blog-post-container");

const formatBlogDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString("en", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }).toLowerCase();
};

const renderTags = (tags) => {
    if (!tags || tags.length === 0) {
        return null;
    }

    const tagList = document.createElement("p");
    tagList.className = "blog-post-tags";
    tagList.textContent = tags.map((tag) => `#${tag}`).join(" ");

    return tagList;
};

const renderBody = (body) => {
    const bodyElement = document.createElement("div");
    bodyElement.className = "blog-post-body";

    if (!body || body.length === 0) {
        return bodyElement;
    }

    body.forEach((paragraph) => {
        const paragraphElement = document.createElement("p");
        paragraphElement.textContent = paragraph;
        bodyElement.append(paragraphElement);
    });

    return bodyElement;
};

const renderBlogPost = (post) => {
    const postElement = document.createElement("article");
    postElement.className = "blog-post-full";

    const date = document.createElement("p");
    date.className = "blog-post-date";
    date.textContent = formatBlogDate(post.date);

    const title = document.createElement("h1");
    title.textContent = post.title;

    postElement.append(date, title);

    const tags = renderTags(post.tags);
    if (tags) {
        postElement.append(tags);
    }

    postElement.append(renderBody(post.body));

    return postElement;
};

const getPostIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};

const loadPost = async (postId) => {
    try {
        const response = await fetch(`blog-posts/${postId}.json`, { cache: "no-cache" });
        if (!response.ok) {
            throw new Error(`Could not load post: ${postId}`);
        }
        const post = await response.json();
        blogPostContainer.replaceChildren(renderBlogPost(post));
        document.title = `${post.title} | vishruti ranjan`;
    } catch (error) {
        blogPostContainer.replaceChildren(
            Object.assign(document.createElement("p"), {
                textContent: "Error loading post. Please try again later."
            })
        );
        console.error(error);
    }
};

const postId = getPostIdFromUrl();
if (postId) {
    loadPost(postId);
} else {
    blogPostContainer.replaceChildren(
        Object.assign(document.createElement("p"), {
            textContent: "No post specified. Please return to the blog listing."
        })
    );
}
