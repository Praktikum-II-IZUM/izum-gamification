/**
 * Testi za PuzzleGame komponento
 * 
 * Testi preverjajo osnovno funkcionalnost sestavljanke:
 * - Prikaz osnovnih elementov vmesnika (števec, točke, gumbi)
 * - Pravilno inicializacijo igre
 * 
 * Uporabljajo se mock-ani moduli za shranjevanje stanja in točkovanje,
 * ter simulacija nalaganja slik za potrebe testiranja.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { PuzzleGame } from '../PuzzleGame';
import '@testing-library/jest-dom';

const mockOnComplete = jest.fn();

jest.mock('@/utils/gameStorage', () => ({
  GameStorage: {
    saveGameState: jest.fn(),
    loadGameState: jest.fn(() => null),
    clearGameState: jest.fn(),
  },
}));

jest.mock('@/utils/scoringSystem', () => ({
  getScoringConfig: jest.fn(() => ({
    maxScore: 1000,
    timeLimit: 300,
    baseScore: 500,
  })),
  calculateScore: jest.fn(() => ({
    score: 750,
    timeBonus: 250, 
    moveBonus: 0,  
    timePenalty: 0, 
    movePenalty: 0, 
    hintsUsed: 0,
  })),
}));

class MockImage {
  constructor() {
    setTimeout(() => {
      this.onload();
    }, 0);
  }
  onload() {}
  onerror() {}
  src = '';
  width = 600;
  height = 600;
}

describe('PuzzleGame Komponenta', () => {
  const defaultProps = {
    imageSrc: '/test-slika.jpg',
    rows: 3,
    cols: 3,
    onComplete: mockOnComplete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.Image = MockImage as any;
  });

  it('prikaže osnovne elemente igre', () => {
    render(<PuzzleGame {...defaultProps} />);
    
    expect(screen.getByText('0:00')).toBeInTheDocument();
    expect(screen.getByText('Maksimalno')).toBeInTheDocument();
    expect(screen.getByText('Prikaži rešitev')).toBeInTheDocument();
  });
});
