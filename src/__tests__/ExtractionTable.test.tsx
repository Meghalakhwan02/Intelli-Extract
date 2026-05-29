import React from 'react'
import { render, screen } from '@testing-library/react'
import ExtractionTable from '../components/ExtractionTable'
import type { ExtractionResult } from '../types'

// Framer Motion stubs — avoids animation/RAF issues in jsdom
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr {...props}>{children}</tr>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const sampleData: ExtractionResult[] = [
  { attribute: 'name', m1: 'John Doe', m2: 'John Doe', m3: 'John Doe', score: '0.95' },
  { attribute: 'dob', m1: '1990-01-01', m2: '1990-01-01', m3: '-', score: '0.70' },
]

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('ExtractionTable — rendering', () => {
  it('renders the default title "Extraction Results" when no title prop is given', () => {
    render(<ExtractionTable selectedType="" />)
    expect(screen.getByText('Extraction Results')).toBeInTheDocument()
  })

  it('renders a custom title when the title prop is supplied', () => {
    render(<ExtractionTable selectedType="" title="My Custom Title" />)
    expect(screen.getByText('My Custom Title')).toBeInTheDocument()
  })

  it('renders the table header columns (Attribute, OCR, V1, V2, Score)', () => {
    render(<ExtractionTable selectedType="passport" data={sampleData} />)
    for (const col of ['Attribute', 'OCR', 'V1', 'V2', 'Score']) {
      expect(screen.getByText(col)).toBeInTheDocument()
    }
  })
})

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------
describe('ExtractionTable — loading state', () => {
  it('shows a progress indicator when isLoading is true', () => {
    render(<ExtractionTable selectedType="passport" isLoading={true} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows "Analyzing…" text while loading', () => {
    render(<ExtractionTable selectedType="passport" isLoading={true} />)
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Empty states
// ---------------------------------------------------------------------------
describe('ExtractionTable — empty states', () => {
  it('prompts to upload a document when a type is selected but data is empty', () => {
    render(<ExtractionTable selectedType="passport" data={[]} />)
    expect(
      screen.getByText('Please upload a document to view results')
    ).toBeInTheDocument()
  })

  it('prompts to select a document type when no type is set and data is empty', () => {
    render(<ExtractionTable selectedType="" data={[]} />)
    expect(
      screen.getByText('Select a document type at the top-left')
    ).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Data rows
// ---------------------------------------------------------------------------
describe('ExtractionTable — data rows', () => {
  it('renders one table row per result entry', () => {
    render(<ExtractionTable selectedType="passport" data={sampleData} />)
    expect(screen.getByText('name')).toBeInTheDocument()
    expect(screen.getByText('dob')).toBeInTheDocument()
  })

  it('displays m1 value and score badge for each row', () => {
    render(<ExtractionTable selectedType="passport" data={sampleData} />)
    // 'John Doe' appears in m1/m2/m3 columns — getAllByText is correct here
    expect(screen.getAllByText('John Doe').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('0.95')).toBeInTheDocument()
  })

  it('filters out any row whose attribute is "raw_text"', () => {
    const dataWithRawText: ExtractionResult[] = [
      ...sampleData,
      { attribute: 'raw_text', m1: 'ocr dump', m2: '', m3: '', score: '0' },
    ]
    render(<ExtractionTable selectedType="passport" data={dataWithRawText} />)
    expect(screen.queryByText('raw_text')).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Raw text section
// ---------------------------------------------------------------------------
describe('ExtractionTable — raw text section', () => {
  it('renders the Raw Output section when rawText is provided', () => {
    render(
      <ExtractionTable
        selectedType="passport"
        data={sampleData}
        rawText="OCR raw output here"
      />
    )
    expect(screen.getByText('Raw Output')).toBeInTheDocument()
    expect(screen.getByText('OCR raw output here')).toBeInTheDocument()
  })

  it('does not render the Raw Output section when rawText is empty', () => {
    render(<ExtractionTable selectedType="passport" data={sampleData} rawText="" />)
    expect(screen.queryByText('Raw Output')).not.toBeInTheDocument()
  })
})
