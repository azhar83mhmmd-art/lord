function generateAvatar(nickname) {
  const seed = encodeURIComponent(nickname.trim());
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
}

module.exports = generateAvatar;
