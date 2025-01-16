<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccoutStaff extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id', 
        'staff_salary_expense'
    ];
}
