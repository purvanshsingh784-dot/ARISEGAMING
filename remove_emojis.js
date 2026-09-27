const fs = require('fs');
const path = require('path');

const files = [
  'client/src/components/ui/OrganizerDashboardModal.jsx',
  'client/src/components/homepage/UpcomingTournaments.jsx',
  'client/src/components/homepage/LiveMatches.jsx',
  'client/src/components/homepage/FeedbackSection.jsx'
];

const emojis = ['🏆', '🎮', '💬', '✅', '⚙️', '👥', '⭐', '📡', '✍️', '💰', '🗓️', '⏰', '🎯', '👑', '📝', '📜', '📢', '🔑'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    emojis.forEach(emoji => {
      content = content.split(emoji).join('');
    });
    // Also catch some common unicode combinations
    content = content.replace(/⚙️/g, ''); 
    content = content.replace(/✍️/g, '');
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Removed emojis from: ' + file);
    } else {
      console.log('No emojis found in: ' + file);
    }
  } else {
    console.log('File not found: ' + file);
  }
});
