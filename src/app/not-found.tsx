"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPinOff, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex flex-col items-center space-y-6 max-w-md animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPinOff className="h-12 w-12" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-7xl text-primary">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Page Not Found</h2>
          <p className="text-muted-foreground text-base mt-2">
            Oops! It seems you've ventured into uncharted territory. The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
