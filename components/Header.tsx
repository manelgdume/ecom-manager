'use client'
import { useEffect } from 'react'
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react"
import { usePathname, useSearchParams } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function Header() {
    const { data: session, status } = useSession();

    const pathname = usePathname()
    const searchParams = useSearchParams()


    useEffect(() => {
        const url = `${pathname}`
        console.log(url.includes("dashboard"))
        if (url.includes("dashboard")) {
            const dashboardElement = document.getElementById("dashboard");
            if (dashboardElement) {
                dashboardElement.classList.remove("text-gray-600");
                dashboardElement.classList.add("bg-secondary");
                dashboardElement.classList.add("text-secondary-foreground");

            }
        }

        if (url.includes("products")) {
            const productsElement = document.getElementById("products");
            if (productsElement) {
                productsElement.classList.remove("text-gray-600");
                productsElement.classList.add("bg-secondary");
                productsElement.classList.add("text-secondary-foreground");

            }
        }

        if (url.includes("orders")) {
            const ordersElement = document.getElementById("orders");
            if (ordersElement) {
                ordersElement.classList.remove("text-gray-600");
                ordersElement.classList.add("bg-secondary");
                ordersElement.classList.add("bg-secondary");

            }
        }

        if (url.includes("users")) {
            const usersElement = document.getElementById("users");
            if (usersElement) {
                usersElement.classList.remove("text-gray-600");
                usersElement.classList.add("bg-secondary");
            }
        }
    }, [pathname])
    return (
        <>
        <div className="flex bg-background border-secondary border-2  ">
            <div className="  ml-5 my-4 jus">
                <div className="text-4xl ">Admin</div>
            </div>
            <div className="flex justify-end w-full ">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>

                        <Button variant="ghost" className="  rounded-full mt-5">
                            <div className='mr-2'>{session?.user?.name}</div>
                            <Avatar className="h-8 w-8">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7 mt-[1px]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {session?.user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem  >
                            <Link href="/api/auth/signout">Logout</Link>
                         </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        </>
    );
}

export default Header;