// turns text (the user's id) into the same number every time, so a user always gets the same placeholder
function hashCode(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash * 31 + text.charCodeAt(i)) % 1000003;
    }
    return hash;
}

// builds a small SVG picture from that number: two colours, a soft circle and the user's initial
function placeholderSrc(user) {
    const h = hashCode(String(user._id || user.username));
    const hue1 = h % 360;
    const hue2 = (hue1 + 40 + (h % 80)) % 360;
    const cx = 20 + (h % 60);
    const cy = 20 + (Math.floor(h / 7) % 60);
    const r = 15 + (h % 20);
    const initial = (user.username || "?").charAt(0).toUpperCase().replace(/[^A-Z0-9]/, "?");
    const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>` +
        `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
        `<stop offset='0' stop-color='hsl(${hue1},55%,75%)'/>` +
        `<stop offset='1' stop-color='hsl(${hue2},55%,62%)'/>` +
        `</linearGradient></defs>` +
        `<rect width='100' height='100' fill='url(#g)'/>` +
        `<circle cx='${cx}' cy='${cy}' r='${r}' fill='white' fill-opacity='0.3'/>` +
        `<text x='50' y='64' font-size='44' text-anchor='middle' fill='white' font-family='sans-serif'>${initial}</text>` +
        `</svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function Avatar({ user, className = "w-10 h-10" }) {
    const src = user.avatarUrl
        ? `http://localhost:5000${user.avatarUrl}`   // an uploaded picture
        : placeholderSrc(user);                      // otherwise a generated placeholder
    return <img src={src} alt={user.username} className={`${className} rounded-full object-cover`} />;
}

export default Avatar;