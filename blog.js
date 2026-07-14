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

const renderBlogPostPreview = (post) => {
    const postElement = document.createElement("details");
    postElement.className = "blog-post-preview";

    const summaryElement = document.createElement("summary");
    summaryElement.className = "blog-post-summary";

    const date = document.createElement("p");
    date.className = "blog-post-date";
    date.textContent = formatBlogDate(post.date);

    const title = document.createElement("h3");
    title.textContent = post.title;

    const summary = document.createElement("p");
    summary.textContent = post.summary;

    summaryElement.append(date, title, summary);

    const tags = renderTags(post.tags);
    if (tags) {
        summaryElement.append(tags);
    }

    postElement.append(summaryElement, renderBody(post.body));

    return postElement;
};

const renderBlogPosts = (posts) => {
    const sortedPosts = [...posts].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    if (sortedPosts.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "nothing here yet, but the notebook is open.";
        blogPostList.replaceChildren(emptyMessage);
        return;
    }

    blogPostList.replaceChildren(...sortedPosts.map(renderBlogPostPreview));
};

fetch("blog-posts.json", { cache: "no-cache" })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Could not load blog-posts.json");
        }

        return response.json();
    })
    .then((manifest) => Promise.all(
        manifest.posts.map((postPath) => fetch(postPath, { cache: "no-cache" }).then((response) => {
            if (!response.ok) {
                throw new Error(`Could not load ${postPath}`);
            }

            return response.json();
        }))
    ))
    .then(renderBlogPosts)
    .catch((error) => {
        console.error("Blog failed to load:", error);

        const message = document.createElement("p");
        message.textContent = "the blog is taking a short detour. please refresh later.";
        blogPostList.replaceChildren(message);
    });
