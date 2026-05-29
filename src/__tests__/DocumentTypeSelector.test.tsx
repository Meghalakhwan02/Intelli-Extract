import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DocumentTypeSelector, { documentTypes } from '../components/DocumentTypeSelector'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const defaultProps = {
  selectedType: '',
  onSelectType: jest.fn(),
  selectedLanguage: 'english',
  onSelectLanguage: jest.fn(),
}

// ---------------------------------------------------------------------------
// Document type list
// ---------------------------------------------------------------------------
describe('DocumentTypeSelector — document type list', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders all 8 document type options', () => {
    render(<DocumentTypeSelector {...defaultProps} />)
    for (const type of documentTypes) {
      expect(screen.getByText(type.name)).toBeInTheDocument()
    }
  })

  it('calls onSelectType with the correct id when a type is clicked', async () => {
    const onSelectType = jest.fn()
    render(<DocumentTypeSelector {...defaultProps} onSelectType={onSelectType} />)

    await userEvent.click(screen.getByText('Passport'))

    expect(onSelectType).toHaveBeenCalledTimes(1)
    expect(onSelectType).toHaveBeenCalledWith('passport')
  })

  it('calls onSelectType with "license" when Driving License is clicked', async () => {
    const onSelectType = jest.fn()
    render(<DocumentTypeSelector {...defaultProps} onSelectType={onSelectType} />)

    await userEvent.click(screen.getByText('Driving License'))

    expect(onSelectType).toHaveBeenCalledWith('license')
  })

  it('visually marks the currently selected type as active', () => {
    render(<DocumentTypeSelector {...defaultProps} selectedType="voterid" />)
    // Mui-selected lives on the MuiListItemButton root element
    const voterButton = screen.getByText('Voter ID').closest('.MuiListItemButton-root')
    expect(voterButton).toHaveClass('Mui-selected')
  })
})

// ---------------------------------------------------------------------------
// Language selector visibility
// ---------------------------------------------------------------------------
describe('DocumentTypeSelector — language selector', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the language selector when showLanguage is true (default)', () => {
    render(<DocumentTypeSelector {...defaultProps} />)
    // MUI Select renders both a <label> and an inner <span> with the same text
    expect(screen.getAllByText('Select Language').length).toBeGreaterThanOrEqual(1)
  })

  it('hides the language selector when showLanguage is false', () => {
    render(<DocumentTypeSelector {...defaultProps} showLanguage={false} />)
    expect(screen.queryAllByText('Select Language')).toHaveLength(0)
  })
})
