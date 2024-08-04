<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentMonthlyReceivable extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'contact_id',
        'value'
    ];
}
