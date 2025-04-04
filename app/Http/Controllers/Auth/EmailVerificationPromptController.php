<?php

namespace App\Http\Controllers\Auth;

use Inertia\{Inertia, Response};
use App\Http\Controllers\Controller;
use Illuminate\Http\{RedirectResponse, Request};

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        return $request->user()->hasVerifiedEmail()
                    ? redirect()->intended(route('dashboard', absolute: false))
                    : Inertia::render('auth/verify-email', ['status' => session('status')]);
    }
}
