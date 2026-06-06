import { SYLLABUS_CHECKLIST } from '../syllabusChecklistData';

export const ALL_TOPICS: { id: string, text: string, type: 'AS' | 'AL', parent: string }[] = [];
SYLLABUS_CHECKLIST.forEach(section => {
  const type = parseInt(section.id) <= 6 ? 'AS' : 'AL';
  section.subsections.forEach(sub => {
    // sub.title already includes the id (e.g. "1.1 Scarcity...")
    ALL_TOPICS.push({ id: sub.id, text: sub.title, type, parent: section.title });
  });
});
