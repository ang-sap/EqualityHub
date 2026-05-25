// --- GLOBAL MODAL FUNCTIONS ---
function showModal(title, message) {
    const modal = document.getElementById("customModal");
    if (modal) {
        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalMessage").innerText = message;
        modal.classList.add("active");
    } else {
        alert(title + "\n\n" + message); // Fallback just in case
    }
}

function closeModal() {
    const modal = document.getElementById("customModal");
    if (modal) modal.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. COMMUNITY FORUM LOGIC (Synced with LocalStorage) ---
    const btnShareStory = document.getElementById("btnShareStory");
    const newPostForm = document.getElementById("newPostForm");
    const submitPostBtn = document.getElementById("submitPostBtn");
    const forumFeed = document.getElementById("forumFeed");

    // Toggle Post Form
    if (btnShareStory) {
        btnShareStory.addEventListener("click", () => {
            newPostForm.style.display = newPostForm.style.display === "none" ? "block" : "none";
        });
    }

    // Function to render dynamic posts from LocalStorage
    function renderForumPosts() {
        if (!forumFeed) return;

        // Remove old dynamic posts so we don't duplicate them on refresh
        document.querySelectorAll('.dynamic-post').forEach(e => e.remove());

        let posts = JSON.parse(localStorage.getItem("eh_posts")) || [];

        // Reverse array so newest is at the top
        posts.slice().reverse().forEach(p => {
            const newPost = document.createElement("article");
            newPost.className = "forum-post dynamic-post"; // Added dynamic-post class
            newPost.innerHTML = `
                <div style="width: 50px; height: 50px; border-radius: 50%; background-color: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px;">A</div>
                <div class="post-content" style="width: 100%;">
                    <div style="display: flex; justify-content: space-between;">
                        <h5 class="post-title">${p.title}</h5>
                    </div>
                    <div class="post-meta"><span class="tag">${p.category}</span> | Posted by Anonymous | ${p.date}</div>
                    <p style="font-size: 14px; margin: 10px 0 20px 0; color: var(--text-muted);">${p.text}</p>
                    <div style="display: flex; gap: 5px; margin-top: 10px;">
                        <input type="text" class="form-control reply-input" placeholder="Talk to them..." style="padding:8px; font-size:12px;">
                        <button class="btn reply-btn" style="padding: 5px 15px; font-size: 12px;">Reply</button>
                    </div>
                </div>
            `;
            // Add custom posts above the hardcoded dummy post
            forumFeed.prepend(newPost);
        });

        attachReplyListeners();
    }

    // Handle Submitting a New Post
    if (submitPostBtn) {
        submitPostBtn.addEventListener("click", () => {
            const title = document.getElementById("postTitle").value;
            const category = document.getElementById("postCategory").value;
            const text = document.getElementById("postText").value;

            if (title.trim() === "" || text.trim() === "") {
                showModal("Missing Information", "Please fill out the title and your story before posting.");
                return;
            }

            // Save to LocalStorage
            let posts = JSON.parse(localStorage.getItem("eh_posts")) || [];
            posts.push({
                id: Date.now(),
                date: new Date().toLocaleDateString(), // Shorter date format for posts
                title: title,
                category: category,
                text: text
            });
            localStorage.setItem("eh_posts", JSON.stringify(posts));

            // Reset Form and Re-render
            document.getElementById("postTitle").value = "";
            document.getElementById("postText").value = "";
            newPostForm.style.display = "none";

            renderForumPosts();
        });
    }

    // Handle Replies
    function attachReplyListeners() {
        const replyBtns = document.querySelectorAll(".reply-btn");
        replyBtns.forEach(btn => btn.replaceWith(btn.cloneNode(true))); // Remove old listeners

        document.querySelectorAll(".reply-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const input = this.previousElementSibling;
                const replyText = input.value;
                if (replyText.trim() === "") return;

                const replyContainer = this.parentElement;
                const newReply = document.createElement("div");
                newReply.style = "font-size: 13px; margin-bottom: 10px; padding: 10px; border-radius: 5px; background: #e2e8f0; border-left: 3px solid var(--primary);";
                newReply.innerHTML = `<strong>You:</strong> ${replyText}`;

                replyContainer.parentElement.insertBefore(newReply, replyContainer);
                input.value = "";
            });
        });
    }

    // Initialize forum posts on page load
    renderForumPosts();


    // --- 2. INCIDENT REPORT LOGIC ---
    const incidentForm = document.getElementById("incidentForm");
    if (incidentForm) {
        incidentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const details = document.getElementById("incidentDetails").value;

            let reports = JSON.parse(localStorage.getItem("eh_reports")) || [];
            reports.push({
                id: Date.now(),
                date: new Date().toLocaleString(),
                details: details,
                status: 'Pending',
                important: false,
                note: ''
            });
            localStorage.setItem("eh_reports", JSON.stringify(reports));

            showModal("Report Submitted", "Thank you. Your report has been securely submitted to the administrators. You are not alone.");
            incidentForm.reset();
        });
    }

    // --- 3. GENERAL FEEDBACK LOGIC ---
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("feedbackName").value || "Anonymous";
            const email = document.getElementById("feedbackEmail").value || "No email provided";
            const message = document.getElementById("feedbackMessage").value;

            let feedback = JSON.parse(localStorage.getItem("eh_feedback")) || [];
            feedback.push({
                id: Date.now(),
                date: new Date().toLocaleString(),
                name: name,
                email: email,
                message: message,
                status: 'New',
                reply: ''
            });
            localStorage.setItem("eh_feedback", JSON.stringify(feedback));

            showModal("Feedback Sent", "Message sent! Thank you for your feedback.");
            feedbackForm.reset();
        });
    }
});