<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactStudent extends Model
{
    use HasFactory;

    protected $fillable = [
                            'contact_id', 
                            'father_name',
                            'mother_name',
                            'birthday',
                            'entry_year',
                            'no_ref',
                          ];

    
}
