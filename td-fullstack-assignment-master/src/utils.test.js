/* eslint-env mocha */
import { expect } from 'chai';
import { detectSums } from './utils';

describe('Detect sums', () => {
  const fn = detectSums;

  /*****************   Input Validation   ****************** */

  it('should fail if input is not an array', () => {
    expect(() => fn()).to.throw('Input is not an array');
  });

  it('should throw for string input', () => {
    expect(() => fn('1,2,3')).to.throw('Input is not an array');
  });

  it('should throw for null input', () => {
    expect(() => fn(null)).to.throw('Input is not an array');
  });

  /*****************   Return type   ****************** */

  it('should return an array', () => {
    expect(fn([])).to.be.instanceof(Array);
  });

  /*****************   Edge cases   ****************** */

      it('should return [] for an empty array', () => {
      expect(fn([])).to.deep.equal([]);
    });

    it('should return [] for a single-element array', () => {
      expect(fn([5])).to.deep.equal([]);
    });

    it('should return [] for two elements with no valid sum', () => {
      // Only 2 elements — impossible to find 3 distinct indices
      expect(fn([1, 2])).to.deep.equal([]);
    });

    it('should return [] when an element would have to be used twice as a part ([1, 2, 4])', () => {
      // 2+2=4 would reuse index 1
      expect(fn([1, 2, 4])).to.deep.equal([]);
    });

    it('should return [] when an element would have to be used twice as sum+part ([3, 0, 2])', () => {
      // 3+0=3 would reuse index 0 as both part and sum
      expect(fn([3, 0, 2])).to.deep.equal([]);
    });

  /*****************   Basic cases   ****************** */

  it('[1, 2, 3] → one result', () => {
      // 1+2=3  →  A[0]+A[1]=A[2]
      const result = fn([1, 2, 3]);
      expect(result).to.have.lengthOf(1);
      expect(result).to.deep.include({ pA: 0, pB: 1, sum: 2 });
    });

    it('[3, 0, 3] → two results (zero as a part)', () => {
      // 3+0=3  →  A[0]+A[1]=A[2]  and  A[1]+A[2]=A[0]
      const result = fn([3, 0, 3]);
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.include({ pA: 0, pB: 1, sum: 2 });
      expect(result).to.deep.include({ pA: 1, pB: 2, sum: 0 });
    });

    it('[1, 2, 3, 4] → two results', () => {
      // 1+2=3, 1+3=4
      const result = fn([1, 2, 3, 4]);
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.include({ pA: 0, pB: 1, sum: 2 });
      expect(result).to.deep.include({ pA: 0, pB: 2, sum: 3 });
    });

    it('[1, 2, 3, 4, 5] → four results', () => {
      // 1+2=3, 1+3=4, 1+4=5, 2+3=5
      const result = fn([1, 2, 3, 4, 5]);
      expect(result).to.have.lengthOf(4);
      expect(result).to.deep.include({ pA: 0, pB: 1, sum: 2 });
      expect(result).to.deep.include({ pA: 0, pB: 2, sum: 3 });
      expect(result).to.deep.include({ pA: 0, pB: 3, sum: 4 });
      expect(result).to.deep.include({ pA: 1, pB: 2, sum: 4 });
    });


  /*****************   Duplicate values   ****************** */
  
  it('[1, 2, 1, 3] → three results, each index-combination exactly once', () => {
    // 1+2=3 at (0,1) and (1,2); 1+1=2 at (0,2)
    const result = fn([1, 2, 1, 3]);
    expect(result).to.have.lengthOf(3);
    expect(result).to.deep.include({ pA: 0, pB: 1, sum: 3 });
    expect(result).to.deep.include({ pA: 0, pB: 2, sum: 1 });
    expect(result).to.deep.include({ pA: 1, pB: 2, sum: 3 });
  });

  it('[1, 2, 1, 2, 3] → six results', () => {
    const result = fn([1, 2, 1, 2, 3]);
    expect(result).to.have.lengthOf(6);
    expect(result).to.deep.include({ pA: 0, pB: 1, sum: 4 });
    expect(result).to.deep.include({ pA: 0, pB: 2, sum: 1 });
    expect(result).to.deep.include({ pA: 0, pB: 2, sum: 3 });
    expect(result).to.deep.include({ pA: 0, pB: 3, sum: 4 });
    expect(result).to.deep.include({ pA: 1, pB: 2, sum: 4 });
    expect(result).to.deep.include({ pA: 2, pB: 3, sum: 4 });
  });



  /*****************   Zeros   ****************** */
  
  it('[0, 0, 0] → three results (all-zero array)', () => {
    // every pair of indices sums to 0 which equals the third element
    const result = fn([0, 0, 0]);
    expect(result).to.have.lengthOf(3);
    expect(result).to.deep.include({ pA: 0, pB: 1, sum: 2 });
    expect(result).to.deep.include({ pA: 0, pB: 2, sum: 1 });
    expect(result).to.deep.include({ pA: 1, pB: 2, sum: 0 });
  });


  /*****************   Negative numbers  ****************** */
  
  it('handles negative numbers: [-1, 2, 1]', () => {
    // -1+2=1  →  A[0]+A[1]=A[2]
    const result = fn([-1, 2, 1]);
    expect(result).to.have.lengthOf(1);
    expect(result).to.deep.include({ pA: 0, pB: 1, sum: 2 });
  });

  it('handles all-negative arrays: [-3, -2, -1]', () => {
    // -3+(-2)=-5 (no match), -3+(-1)=-4 (no match), -2+(-1)=-3  →  A[1]+A[2]=A[0]
    const result = fn([-3, -2, -1]);
    expect(result).to.have.lengthOf(1);
    expect(result).to.deep.include({ pA: 1, pB: 2, sum: 0 });
  });

 /*****************   Negative numbers  ****************** */
  
  it('handles negative numbers: [-1, 2, 1]', () => {
    // -1+2=1  →  A[0]+A[1]=A[2]
    const result = fn([-1, 2, 1]);
    expect(result).to.have.lengthOf(1);
    expect(result).to.deep.include({ pA: 0, pB: 1, sum: 2 });
  });

  it('handles all-negative arrays: [-3, -2, -1]', () => {
    // -3+(-2)=-5 (no match), -3+(-1)=-4 (no match), -2+(-1)=-3  →  A[1]+A[2]=A[0]
    const result = fn([-3, -2, -1]);
    expect(result).to.have.lengthOf(1);
    expect(result).to.deep.include({ pA: 1, pB: 2, sum: 0 });
  });


 /*****************  No duplicates guard  ****************** */
  it('should never return {pA, pB, sum} and {pA: pB, pB: pA, sum} together', () => {
      // For any valid input the same unordered pair {i,j} must appear at most once per sum
      const result = fn([1, 2, 1, 2, 3]);
      const seen = new Set();
      result.forEach(({ pA, pB, sum }) => {
        const key = `${Math.min(pA, pB)}-${Math.max(pA, pB)}-${sum}`;
        expect(seen.has(key), `duplicate entry for key ${key}`).to.equal(false);
        seen.add(key);
      });
    });
  
});
