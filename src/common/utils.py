
# Database object convertors


def from_db_object(resource, db_obj):
    """ Convert db obj to dict """
    user = dict()
    for field in resource:
        user[field] = db_obj.__getattribute__(field)
    return user


def from_db_object_list(resource, db_objects):
    """ Convert db obj to list of dicts """
    return [from_db_object(resource, obj) for obj in db_objects]
