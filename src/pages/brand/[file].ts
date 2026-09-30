/**
 * /brand/<file>.svg: static logo downloads for the brand page (src/lib/logoFiles.ts).
 * Built once at build time; nothing links here except /brand.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { logoFiles, logoSvg, type LogoFile } from '../../lib/logoFiles';

export const getStaticPaths = (() =>
  logoFiles.map((f) => ({
    params: { file: f.file },
    props: { logo: f },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ logo: LogoFile }> = ({ props }) =>
  new Response(logoSvg(props.logo), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
