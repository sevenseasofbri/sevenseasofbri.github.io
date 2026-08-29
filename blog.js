const blogPostList = document.getElementById("blog-post-list");

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

const renderBlogPostPreview = (post, postId) => {
    const postElement = document.createElement("article");
    postElement.className = "blog-post-preview";

    const link = document.createElement("a");
    link.href = `blog-post.html?id=${postId}`;
    link.className = "blog-post-link";

    const date = document.createElement("p");
    date.className = "blog-post-date";
    date.textContent = formatBlogDate(post.date);

    const title = document.createElement("h3");
    title.textContent = post.title;

    const summary = document.createElement("p");
    summary.textContent = post.summary;

    link.append(date, title, summary);

    const tags = renderTags(post.tags);
    if (tags) {
        link.append(tags);
    }

    postElement.append(link);

    return postElement;
};

const renderBlogPosts = (posts, postIds) => {
    const sortedPosts = [...posts].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    if (sortedPosts.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "nothing here yet, but the notebook is open.";
        blogPostList.replaceChildren(emptyMessage);
        return;
    }

    const sortedIndices = [...posts].map((_, i) => i).sort(
        (a, b) => new Date(posts[b].date) - new Date(posts[a].date)
    );

    blogPostList.replaceChildren(...sortedIndices.map(i => renderBlogPostPreview(posts[i], postIds[i])));
};

fetch("blog-posts.json", { cache: "no-cache" })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Could not load blog-posts.json");
        }

        return response.json();
    })
    .then((manifest) => {
        const postIds = manifest.posts.map(path => path.replace("blog-posts/", "").replace(".json", ""));
        return Promise.all(
            manifest.posts.map((postPath) => fetch(postPath, { cache: "no-cache" }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Could not load ${postPath}`);
                }

                return response.json();
            }))
        ).then(posts => ({ posts, postIds }));
    })
    .then((data) => {
        renderBlogPosts(data.posts, data.postIds);
    })
    .catch((error) => {
        console.error("Blog failed to load:", error);

        const message = document.createElement("p");
        message.textContent = "the blog is taking a short detour. please refresh later.";
        blogPostList.replaceChildren(message);
    });
