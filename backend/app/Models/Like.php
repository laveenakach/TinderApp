<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\People;

class Like extends Model
{
    use HasFactory;
    protected $fillable = ['user_id','people_id'];
    public function people() {
        return $this->belongsTo(People::class, 'people_id'); 
    }

}
