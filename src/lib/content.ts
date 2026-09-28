/**
 * Typed, pre-sorted content getters. Components call these instead of
 * querying collections directly, so ordering and publish rules live in one place.
 */
import { getCollection, getEntry } from 'astro:content';

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

/** Published case studies (all of them, for /work and /work/[slug]). */
export async function getWork() {
  return getCollection('work', ({ data }) => data.published);
}

/** Case studies placed in the homepage grid, in grid order. */
export async function getHomeWork() {
  const all = await getWork();
  return all
    .filter((e) => e.data.homeSlot !== null)
    .sort((a, b) => a.data.homeOrder - b.data.homeOrder);
}

export async function getTestimonials() {
  const all = await getCollection('testimonials', ({ data }) => data.published);
  return all.sort(byOrder);
}

export async function getClients() {
  return (await getCollection('clients')).sort(byOrder);
}

export async function getFaq() {
  return (await getCollection('faq')).sort(byOrder);
}

export async function getJobs() {
  const all = await getCollection('jobs', ({ data }) => data.published);
  return all.sort(byOrder);
}

export async function getJournal() {
  const all = await getCollection('journal', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Homepage copy. Throws at build time if home.json is missing. */
export async function getHome() {
  const entry = await getEntry('home', 'home');
  if (!entry) throw new Error('src/content/pages/home.json is missing.');
  return entry.data;
}

/** Inner-page SEO + heading by route id ("about", "work", "404", …). */
export async function getPage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`src/content/pages/${id}.json is missing.`);
  return entry.data;
}
