import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PanFormDetails from '../components/PanFormDetails'
import * as api from '../services/api'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('../services/api', () => ({
  recordPanDetails: jest.fn(),
}))

const filledData = {
  fullName: 'John Doe',
  gender: 'Male',
  dob: '1990-01-01',
  address: '123 Main St, New Delhi',
  fatherName: 'James Doe',
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('PanFormDetails — rendering', () => {
  it('renders the section heading and all visible form fields', () => {
    render(
      <PanFormDetails data={filledData} onChange={jest.fn()} onNext={jest.fn()} />
    )

    expect(screen.getByText('PAN Form Details')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g JOHN DOE')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g. SM J DOE')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter complete address...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next Step/i })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Button disabled state
// ---------------------------------------------------------------------------
describe('PanFormDetails — button disabled state', () => {
  it('disables Next Step when fullName is empty', () => {
    render(
      <PanFormDetails
        data={{ ...filledData, fullName: '' }}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /Next Step/i })).toBeDisabled()
  })

  it('disables Next Step when dob is empty', () => {
    render(
      <PanFormDetails
        data={{ ...filledData, dob: '' }}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /Next Step/i })).toBeDisabled()
  })

  it('enables Next Step when both fullName and dob are provided', () => {
    render(
      <PanFormDetails data={filledData} onChange={jest.fn()} onNext={jest.fn()} />
    )
    expect(screen.getByRole('button', { name: /Next Step/i })).not.toBeDisabled()
  })
})

// ---------------------------------------------------------------------------
// API interaction
// ---------------------------------------------------------------------------
describe('PanFormDetails — API interaction', () => {
  beforeEach(() => jest.clearAllMocks())

  it('calls onNext after a successful API response', async () => {
    jest.mocked(api.recordPanDetails).mockResolvedValueOnce({
      success: true,
      record_id: 'rec_abc',
    })
    const onChange = jest.fn()
    const onNext = jest.fn()

    render(<PanFormDetails data={filledData} onChange={onChange} onNext={onNext} />)
    await userEvent.click(screen.getByRole('button', { name: /Next Step/i }))

    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
    expect(api.recordPanDetails).toHaveBeenCalledWith(filledData)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ recordId: 'rec_abc' })
    )
  })

  it('displays an error message when the API call rejects', async () => {
    jest.mocked(api.recordPanDetails).mockRejectedValueOnce(new Error('Network error'))
    const onNext = jest.fn()

    render(<PanFormDetails data={filledData} onChange={jest.fn()} onNext={onNext} />)
    await userEvent.click(screen.getByRole('button', { name: /Next Step/i }))

    await waitFor(() =>
      expect(screen.getByText('Network error')).toBeInTheDocument()
    )
    expect(onNext).not.toHaveBeenCalled()
  })

  it('shows a fallback error when API returns success: false', async () => {
    jest.mocked(api.recordPanDetails).mockResolvedValueOnce({
      success: false,
      record_id: '',
    })
    const onNext = jest.fn()

    render(<PanFormDetails data={filledData} onChange={jest.fn()} onNext={onNext} />)
    await userEvent.click(screen.getByRole('button', { name: /Next Step/i }))

    await waitFor(() =>
      expect(
        screen.getByText('Failed to record details. Please try again.')
      ).toBeInTheDocument()
    )
    expect(onNext).not.toHaveBeenCalled()
  })

  it('shows a loading indicator while the API request is in flight', async () => {
    let resolveApi!: (v: { success: boolean; record_id: string }) => void
    jest.mocked(api.recordPanDetails).mockReturnValueOnce(
      new Promise(res => { resolveApi = res })
    )

    render(<PanFormDetails data={filledData} onChange={jest.fn()} onNext={jest.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /Next Step/i }))

    // While the promise is pending the button should show "Processing..."
    expect(screen.getByText('Processing...')).toBeInTheDocument()

    // Resolve so the component can finish
    resolveApi({ success: true, record_id: 'rec_ok' })
  })
})
