import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import {CircleEllipsis} from 'lucide-react'
import { forwardRef } from 'react'

const YellowCircleEllipsis = forwardRef<SVGSVGElement, React.ComponentProps<typeof CircleEllipsis>>(
  (props, ref) => <CircleEllipsis ref={ref} {...props} color="#f59e0b" />
)

const RedCrossCircledIcon = forwardRef<SVGSVGElement, React.ComponentProps<typeof CrossCircledIcon>>(
  (props, ref) => <CrossCircledIcon ref={ref} {...props} style={{ color: '#ef4444' }} />
)

const GreenCheckCircledIcon = forwardRef<SVGSVGElement, React.ComponentProps<typeof CheckCircledIcon>>(
  (props, ref) => <CheckCircledIcon ref={ref} {...props} style={{ color: '#22c55e' }} />
)

export const roles = [
  {
    value: 'admin',
    label: 'Administrator',
  },
  {
    value: 'dev',
    label: 'Developer',
  },
  {
    value: 'user',
    label: 'User',
  },
  {
    value: 'guest',
    label: 'Guest',
  },
  
] as const;

export const statuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: YellowCircleEllipsis,
  },  
  {
    value: 'delete',
    label: 'Delete',
    icon: RedCrossCircledIcon,
  },
  {
    value: 'active',
    label: 'Active',
    icon: GreenCheckCircledIcon,
  },
]
