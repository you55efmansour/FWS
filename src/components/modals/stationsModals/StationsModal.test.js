import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StationsModal from './StationsModal';

// Mock dependencies
jest.mock('../../../stores/StationsStore', () => ({
  getStationById: jest.fn(),
  getLastObservations: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('mobx-react', () => ({
  observer: (comp) => comp,
}));

// Mock child components
jest.mock('./StationsTable', () => () => <div data-testid="stations-table">StationsTable</div>);
jest.mock('./StationsChart', () => () => <div data-testid="stations-chart">StationsChart</div>);
jest.mock('./CrossSectionChart', () => () => <div data-testid="cross-section-chart">CrossSectionChart</div>);
jest.mock('./GaugeChart', () => () => <div data-testid="gauge-chart">GaugeChart</div>);
jest.mock('./InfDataTable', () => () => <div data-testid="inf-data-table">InfDataTable</div>);

describe('StationsModal', () => {
  const mockProps = {
    elementId: '123',
    close: jest.fn(),
    stationName: 'Test Station',
    type: 'WaterLevel',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal header and station data when waterLevelStation is available', async() => {
    const stationsStore = require('../../../stores/StationsStore');
    stationsStore.getStationById.mockResolvedValue({
      data: {
        result: {
          id: '123',
          name: 'Test Station',
          city: 'Test City',
          datastreams: [{ id: 'ds1', name: 'WaterLevel', latestObservation: { lastResult: 10 } }],
          alertL1: 5,
          alertL2: 8,
          jsonX: [1, 2, 3],
          jsonY: [4, 5, 6],
        },
      },
    });
    stationsStore.getLastObservations.mockResolvedValue({
      data: {
        result: [{ obsTimestamp: '2023-10-01T12:00:00Z', result: 10 }],
      },
    });

    render(<StationsModal {...mockProps} />);
    
    // Check modal header
    expect(screen.getByText('stationsModal.header')).toBeInTheDocument();

    // Check station ID
    expect(await screen.findByText('stationsModal.labels.stationId')).toBeInTheDocument();

    // Check child components
    expect(await screen.findByTestId('stations-table')).toBeInTheDocument();
    expect(await screen.findByTestId('stations-chart')).toBeInTheDocument();
    expect(await screen.findByTestId('gauge-chart')).toBeInTheDocument();
    expect(await screen.findByTestId('inf-data-table')).toBeInTheDocument();
  });

  it('displays alert when chartData is not available', async () => {
    const stationsStore = require('../../../stores/StationsStore');
    stationsStore.getStationById.mockResolvedValue({
      data: {
        result: {
          id: '123',
          name: 'Test Station',
          city: 'Test City',
          datastreams: [{ id: 'ds1', name: 'WaterLevel', latestObservation: null }],
        },
      },
    });
    stationsStore.getLastObservations.mockResolvedValue({
      data: { result: [] },
    });

    render(<StationsModal {...mockProps} />);
    
  });

  it('switches to cross-section view when crosssection button is clicked', async () => {
    const stationsStore = require('../../../stores/StationsStore');
    stationsStore.getStationById.mockResolvedValue({
      data: {
        result: {
          id: '123',
          name: 'Test Station',
          city: 'Test City',
          datastreams: [{ id: 'ds1', name: 'WaterLevel', latestObservation: { lastResult: 10 } }],
          alertL1: 5,
          alertL2: 8,
          jsonX: [1, 2, 3],
          jsonY: [4, 5, 6],
        },
      },
    });
    stationsStore.getLastObservations.mockResolvedValue({
      data: {
        result: [{ obsTimestamp: '2023-10-01T12:00:00Z', result: 10 }],
      },
    });

    render(<StationsModal {...mockProps} />);

    // Check timeseries view is default
    expect(await screen.findByTestId('stations-chart')).toBeInTheDocument();

  });

  it('calls getLastObservations when select option changes', async () => {
    const stationsStore = require('../../../stores/StationsStore');
    stationsStore.getStationById.mockResolvedValue({
      data: {
        result: {
          id: '123',
          name: 'Test Station',
          city: 'Test City',
          datastreams: [{ id: 'ds1', name: 'WaterLevel', latestObservation: { lastResult: 10 } }],
        },
      },
    });
    stationsStore.getLastObservations.mockResolvedValue({
      data: {
        result: [{ obsTimestamp: '2023-10-01T12:00:00Z', result: 10 }],
      },
    });

    render(<StationsModal {...mockProps} />);

    // Change select option to 6 hours
    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: '6' } });

    // Check if getLastObservations was called with correct parameters
    expect(stationsStore.getLastObservations).toHaveBeenCalledWith(
      'ds1',
      expect.any(String),
      expect.any(String)
    );
  });
});