import { describe, expect, it } from 'vitest';
import { CuidV2Service } from '@services/cuidv2Service';

describe('CuidV2Service', () => {
  describe('generateCuidV2', () => {
    it('returns a valid CUIDv2', () => {
      const id = CuidV2Service.generateCuidV2();
      expect(CuidV2Service.validateCuidV2(id)).toBe(true);
    });
  });

  describe('validateCuidV2', () => {
    it('accepts a generated id', () => {
      expect(CuidV2Service.validateCuidV2(CuidV2Service.generateCuidV2())).toBe(
        true,
      );
    });

    it('rejects short, uppercase, and invalid characters', () => {
      expect(CuidV2Service.validateCuidV2('short')).toBe(false);
      expect(CuidV2Service.validateCuidV2('A'.repeat(24))).toBe(false);
      expect(CuidV2Service.validateCuidV2(`a${'-'.repeat(23)}`)).toBe(false);
    });
  });

  describe('findCuidV2s', () => {
    it('finds valid ids in text and ignores noise', () => {
      const id = CuidV2Service.generateCuidV2();
      const found = CuidV2Service.findCuidV2s(`before ${id} after SHORT`);
      expect(found).toEqual([id]);
    });
  });

  describe('regenerateAllCuidV2s', () => {
    it('replaces each valid CUIDv2 and preserves surrounding text', () => {
      const id = CuidV2Service.generateCuidV2();
      const input = `prefix ${id} suffix`;
      const result = CuidV2Service.regenerateAllCuidV2s(input);

      expect(result.count).toBe(1);
      expect(result.text.startsWith('prefix ')).toBe(true);
      expect(result.text.endsWith(' suffix')).toBe(true);
      expect(result.text).not.toContain(id);

      const regenerated = result.text.slice('prefix '.length, -' suffix'.length);
      expect(CuidV2Service.validateCuidV2(regenerated)).toBe(true);
    });
  });

  describe('findUuids / replaceAllUuidsWithCuidV2', () => {
    it('finds UUIDs and replaces them with CUIDv2s', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const input = `id=${uuid}`;

      expect(CuidV2Service.findUuids(input)).toEqual([uuid]);

      const result = CuidV2Service.replaceAllUuidsWithCuidV2(input);
      expect(result.count).toBe(1);
      expect(result.text).not.toContain(uuid);

      const replacement = result.text.slice('id='.length);
      expect(CuidV2Service.validateCuidV2(replacement)).toBe(true);
    });
  });

  describe('range helpers', () => {
    it('only regenerates CUIDv2s inside the given range', () => {
      const keep = CuidV2Service.generateCuidV2();
      const change = CuidV2Service.generateCuidV2();
      const text = `${keep} ${change}`;
      const start = keep.length + 1;
      const result = CuidV2Service.regenerateCuidV2sInRange(
        text,
        start,
        text.length,
      );

      expect(result.count).toBe(1);
      expect(result.text.startsWith(keep)).toBe(true);
      expect(result.text).not.toContain(change);
    });

    it('only replaces UUIDs inside the given range', () => {
      const keep = '11111111-1111-1111-1111-111111111111';
      const change = '22222222-2222-2222-2222-222222222222';
      const text = `${keep} ${change}`;
      const start = keep.length + 1;
      const result = CuidV2Service.replaceUuidsWithCuidV2InRange(
        text,
        start,
        text.length,
      );

      expect(result.count).toBe(1);
      expect(result.text.startsWith(keep)).toBe(true);
      expect(result.text).not.toContain(change);
    });
  });
});
