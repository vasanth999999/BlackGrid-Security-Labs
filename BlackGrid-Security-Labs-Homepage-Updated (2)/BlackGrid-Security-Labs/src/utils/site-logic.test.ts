import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createWhatsAppLink,
  getCourseEnquiryMessage,
  getWorkshopEnquiryMessage,
  formatWorkshopDate,
  getNextSlideIndex,
  filterCourses,
  Course,
} from './site-logic';

test('createWhatsAppLink builds valid international format URL', () => {
  const link = createWhatsAppLink('Hello there');
  assert.equal(link, 'https://wa.me/919345832928?text=Hello%20there');
});

test('createWhatsAppLink handles phone with +91 or raw 10 digits', () => {
  const link1 = createWhatsAppLink('Enquiry', '9345832928');
  assert.equal(link1, 'https://wa.me/919345832928?text=Enquiry');

  const link2 = createWhatsAppLink('Enquiry', '919345832928');
  assert.equal(link2, 'https://wa.me/919345832928?text=Enquiry');
});

test('getCourseEnquiryMessage includes the course title', () => {
  const msg = getCourseEnquiryMessage('Digital Forensics & Cybercrime Investigation');
  assert.ok(msg.includes('Digital Forensics & Cybercrime Investigation'));
  assert.ok(msg.includes('BlackGrid Security Labs'));
});

test('getWorkshopEnquiryMessage formats default workshop properly', () => {
  const msg = getWorkshopEnquiryMessage();
  assert.ok(msg.includes('Ethical Hacking Hands-on Workshop'));
});

test('formatWorkshopDate returns "To be announced" for unconfirmed dates', () => {
  assert.equal(formatWorkshopDate(''), 'To be announced');
  assert.equal(formatWorkshopDate(undefined), 'To be announced');
  assert.equal(formatWorkshopDate('To be announced'), 'To be announced');
  assert.equal(formatWorkshopDate('TBA'), 'To be announced');
});

test('getNextSlideIndex computes circular next and prev indices across 7 slides', () => {
  assert.equal(getNextSlideIndex(0, 7, 'next'), 1);
  assert.equal(getNextSlideIndex(6, 7, 'next'), 0);
  assert.equal(getNextSlideIndex(0, 7, 'prev'), 6);
  assert.equal(getNextSlideIndex(3, 7, 'prev'), 2);
});

test('filterCourses searches by title, category, and topics', () => {
  const sampleCourses: Course[] = [
    {
      id: 'soc-analyst',
      title: 'SOC Analyst & Security Operations',
      category: 'cybersecurity',
      description: 'Hands-on SIEM monitoring, log analysis, threat hunting.',
      topics: ['SIEM', 'Splunk', 'Wazuh', 'Incident Response'],
    },
    {
      id: 'python-dev',
      title: 'Python Programming Masterclass',
      category: 'software-development',
      description: 'Complete Python from fundamentals to OOP and automation.',
      topics: ['Python', 'Automation', 'Flask', 'Data Structures'],
    },
  ];

  const socSearch = filterCourses(sampleCourses, 'Splunk');
  assert.equal(socSearch.length, 1);
  assert.equal(socSearch[0].id, 'soc-analyst');

  const catSearch = filterCourses(sampleCourses, '', 'cybersecurity');
  assert.equal(catSearch.length, 1);
  assert.equal(catSearch[0].id, 'soc-analyst');

  const emptySearch = filterCourses(sampleCourses, 'nonexistent query');
  assert.equal(emptySearch.length, 0);
});
