import { SYLLABUS_CHECKLIST } from '../syllabusChecklistData';

export const ALL_TOPICS: { id: string, text: string, type: 'AS' | 'AL', parent: string }[] = [];
SYLLABUS_CHECKLIST.forEach(section => {
  const type = parseInt(section.id) <= 6 ? 'AS' : 'AL';
  section.subsections.forEach(sub => {
    ALL_TOPICS.push({ id: sub.id, text: `${sub.id} ${sub.title}`, type, parent: section.title });
  });
});
