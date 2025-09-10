import { initThemeToggle } from "./themeToggle.js";
import { initTypewriter } from "./typewriter.js";
import { renderTimeline, timelineData } from "./timeline.js";
import { renderSkills, skillsData } from "./skills.js";

// 初始化所有模块
initThemeToggle();
initTypewriter();
renderTimeline(timelineData);
renderSkills(skillsData);

