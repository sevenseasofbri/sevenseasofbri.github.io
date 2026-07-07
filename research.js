const researchList = document.getElementById("research-list");

const formatPublicationDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric"
    }).toLowerCase();
};

const createExternalLink = (link) => {
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.label;

    return anchor;
};

const renderLinks = (links) => {
    if (!links || links.length === 0) {
        return null;
    }

    const linksElement = document.createElement("p");
    linksElement.className = "publication-links";

    links.forEach((link, index) => {
        if (index > 0) {
            linksElement.append(" ");
        }

        linksElement.append(createExternalLink(link));
    });

    return linksElement;
};

const renderPublication = (publication) => {
    const article = document.createElement("article");
    article.className = "publication";

    const title = document.createElement("h3");
    const titleLink = publication.links?.[0];

    if (titleLink) {
        const anchor = createExternalLink({
            label: publication.title,
            url: titleLink.url
        });
        title.append(anchor);
    } else {
        title.textContent = publication.title;
    }

    const authors = document.createElement("p");
    authors.className = "publication-authors";
    authors.textContent = publication.authors.join(", ");

    const metadata = document.createElement("p");
    metadata.className = "publication-meta";
    metadata.textContent = [
        formatPublicationDate(publication.publicationDate),
        publication.venue,
        publication.pages ? `p. ${publication.pages}` : null
    ].filter(Boolean).join(" | ");

    const summary = document.createElement("p");
    summary.textContent = publication.summary;

    article.append(title, authors, metadata, summary);

    const links = renderLinks(publication.links);
    if (links) {
        article.append(links);
    }

    return article;
};

const renderResearch = (publications) => {
    const sortedPublications = [...publications].sort(
        (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
    );

    researchList.replaceChildren(...sortedPublications.map(renderPublication));
};

fetch("research.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Could not load research.json");
        }

        return response.json();
    })
    .then(renderResearch)
    .catch(() => {
        const message = document.createElement("p");
        message.textContent = "publications are taking a short detour. please refresh later.";
        researchList.replaceChildren(message);
    });
