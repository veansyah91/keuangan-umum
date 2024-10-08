<?php

namespace App\Models;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Model;
use App\Models\StudentEntryReceivableLedger;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
			return $query->whereHas('contact', function ($query) use ($search){
				return $query->where('name', 'like', '%'.$search.'%');
			});
		});
	}

	public function contact(): BelongsTo
	{
		return $this->belongsTo(Contact::class);
	}

	public function ledgers(): HasMany
	{
		return $this->hasMany(StudentEntryReceivableLedger::class, 'payment_id');
	}

}
