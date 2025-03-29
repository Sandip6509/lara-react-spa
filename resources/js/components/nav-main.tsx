import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { url, component } = usePage();
    
    const isActive = (item: NavItem) => {
        if (url === item.href) return true;
        
        if (item.activeRoutes) {
            const currentRoute = component?.toLowerCase().replace('/', '.');
            return item.activeRoutes.some(pattern => {
                const regexPattern = pattern
                    .replace('.', '\\.')
                    .replace('*', '.*');
                const regex = new RegExp(`^${regexPattern}$`);
                return regex.test(currentRoute);
            });
        }
        
        return false;
    };
    return (
        <SidebarGroup className='px-2 py-0'>
            <SidebarGroupLabel></SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild 
                            isActive={isActive(item)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}