/**
 * Testi za Timer komponento
 * 
 * Testi preverjajo osnovno funkcionalnost časovnika:
 * - Prikaz začetnega časa (0:00)
 * - Pravilno štetje sekund, ko je časovnik aktiven
 * 
 * Uporabljajo se lažni časovniki (fake timers) za simulacijo preteka časa
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Timer } from '../Timer';

const mockOnTimeUpdate = jest.fn();

const defaultProps = {
  isRunning: false, 
  onTimeUpdate: mockOnTimeUpdate, 
  timeLimit: 300,
};

describe('Timer Komponenta', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('prikaže začetni čas 0:00, ko števec ne teče', () => {
    render(<Timer {...defaultProps} isRunning={false} />);
    const timeElement = screen.getByText('0:00');
    expect(timeElement).toBeInTheDocument();
  });

  it('začne šteti sekunde, ko je isRunning nastavljen na true', () => {
    render(<Timer {...defaultProps} isRunning={true} />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    const timeElement = screen.getByText('0:01');
    expect(timeElement).toBeInTheDocument();
  });
});
