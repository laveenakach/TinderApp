<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Picture;

class People extends Model
{
    use HasFactory;
    protected $fillable = ['name','age','location','bio'];

    public function pictures() 
    { 
        return $this->hasMany(Picture::class,'people_id')->orderBy('order');
     }
}
