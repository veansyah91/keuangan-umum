<?php

namespace App\Models;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentEntryReceivable extends Model
{
	use HasFactory;

	protected $fillable = [
		'organization_id',
		'contact_id',
		'value'
	];

	public function scopeFilter($query, $filters)
	{
		$query->when($filters['search'] ?? false, function ($query, $search) {
			return $query->where('no_ref', 'like', '%'.$search.'%')
										->orWhereHas('contact', function ($query) use ($search){
											$query->where('name', 'like', '%'. $search .'%')
														->orWhereHas('student', function ($query) use ($search){
															$query->where('no_ref', 'like', '%'. $search .'%');
														});
			});
		});
	}

	public function contact(): BelongsTo
	{
		return $this->belongsTo(Contact::class);
	}

}
