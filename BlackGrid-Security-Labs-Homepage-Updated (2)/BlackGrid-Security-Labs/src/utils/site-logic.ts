/**
 * Core utility and pure business logic for BlackGrid Security Labs
 */

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  duration?: string;
  mode?: string;
  level?: string;
  topics: string[];
}

export const WHATSAPP_PHONE = '9345832928';
export const WHATSAPP_COUNTRY_CODE = '91';

/**
 * Generate a formatted WhatsApp chat URL with encoded prefilled message
 */
export function createWhatsAppLink(message: string, phone: string = WHATSAPP_PHONE): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `${WHATSAPP_COUNTRY_CODE}${cleanPhone}`;
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${fullPhone}?text=${encodedText}`;
}

/**
 * Get prefilled message for course enquiry
 */
export function getCourseEnquiryMessage(courseName: string): string {
  return `Hello BlackGrid Security Labs team, I would like to enquire about the "${courseName}" course. Please share the syllabus, upcoming batch schedule, and fee details.`;
}

/**
 * Get prefilled message for workshop enquiry
 */
export function getWorkshopEnquiryMessage(workshopName: string = 'Ethical Hacking Hands-on Workshop'): string {
  return `Hello BlackGrid Security Labs team, I am interested in registering for the "${workshopName}". Please let me know the upcoming dates, venue/online details, and registration procedure.`;
}

/**
 * Validate and format workshop date - ensures unconfirmed dates explicitly display "To be announced"
 */
export function formatWorkshopDate(dateStr?: string | null): string {
  if (!dateStr || dateStr.trim() === '' || dateStr.toLowerCase().includes('tba') || dateStr.toLowerCase().includes('announced')) {
    return 'To be announced';
  }
  return dateStr.trim();
}

/**
 * Circular carousel slide index calculation
 */
export function getNextSlideIndex(currentIndex: number, totalSlides: number, direction: 'next' | 'prev'): number {
  if (totalSlides <= 0) return 0;
  if (direction === 'next') {
    return (currentIndex + 1) % totalSlides;
  }
  return (currentIndex - 1 + totalSlides) % totalSlides;
}

/**
 * Filter courses by search query and category
 */
export function filterCourses(courses: Course[], query: string, category: string = 'all'): Course[] {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedCat = category.toLowerCase().trim();

  return courses.filter((course) => {
    const matchesCategory =
      normalizedCat === 'all' ||
      course.category.toLowerCase().includes(normalizedCat) ||
      normalizedCat.includes(course.category.toLowerCase());

    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const matchesTitle = course.title.toLowerCase().includes(normalizedQuery);
    const matchesDesc = course.description.toLowerCase().includes(normalizedQuery);
    const matchesTopic = course.topics.some((t) => t.toLowerCase().includes(normalizedQuery));

    return matchesTitle || matchesDesc || matchesTopic;
  });
}
