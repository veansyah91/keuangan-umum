<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntryFeeStudentDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'description',
        'value'
    ];
}
