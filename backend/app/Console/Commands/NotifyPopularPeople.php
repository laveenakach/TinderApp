<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB; 
use App\Models\People;
use Illuminate\Support\Facades\Mail;  
use App\Mail\PopularPersonNotification; 

class NotifyPopularPeople extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-popular-people';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $popular = DB::table('likes')
         ->select('people_id', DB::raw('count(*) as cnt'))
         ->groupBy('people_id')
         ->having('cnt','>',50)
         ->get();

        foreach($popular as $p) {
            $person = People::with('pictures')->find($p->people_id);
            \Mail::to(config('mail.admin_email'))->send(new PopularPersonNotification($person, $p->cnt));
        }
    }
}
