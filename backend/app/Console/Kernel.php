<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\People;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        $schedule->call(function () {
        $popular = \App\Models\People::withCount('likes')
            ->having('likes_count', '>=', 1)
            ->get();

        foreach ($popular as $person) {
            \Mail::raw(
                "{$person->name} has been liked more than 50 times!",
                fn($msg) => $msg->to('admin@example.com')->subject('Popular Alert')
            );
        }
    })->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
