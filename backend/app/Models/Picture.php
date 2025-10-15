<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\People;

class Picture extends Model
{
    use HasFactory;
    protected $fillable = ['people_id','path','order'];
    public function people() 
    { 
        return $this->belongsTo(People::class,'people_id');
     }
}
