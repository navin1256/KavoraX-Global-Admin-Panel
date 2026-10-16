import { ref } from 'vue'
import type { NavItem } from '~/types/admin'

export const useAdminNav = () => {
  const isMobileNavOpen = useState<boolean>('admin-mobile-nav', () => false)

  const toggleMobileNav = () => {
    isMobileNavOpen.value = !isMobileNavOpen.value
  }

  const closeMobileNav = () => {
    isMobileNavOpen.value = false
  }

  const openMobileNav = () => {
    isMobileNavOpen.value = true
  }

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      to: '/admin',
      icon: 'LayoutDashboard'
    },
    {
      name: 'Products',
      to: '/admin/products',
      icon: 'Package',
      badge: '4'
    },
    {
      name: 'Solutions',
      to: '/admin/solutions',
      icon: 'Workflow',
      badge: '4'
    },
    {
      name: 'Industries',
      to: '/admin/industries',
      icon: 'Building2',
      badge: '5'
    },
    {
      name: 'Pricing',
      to: '/admin/pricing',
      icon: 'CreditCard'
    },
    {
      name: 'Leads',
      to: '/admin/leads',
      icon: 'Users',
      badge: '3 New'
    },
    {
      name: 'Website Content',
      to: '/admin/content',
      icon: 'FileText'
    },
    {
      name: 'Settings',
      to: '/admin/settings',
      icon: 'Settings'
    }
  ]

  return {
    isMobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
    openMobileNav,
    navItems
  }
}
