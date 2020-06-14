class VitMeetsException(Exception):
    message = "An unknown exception occurred, please check REST-API logs"
    code = 500

    def __init__(self, message=None, **kwargs):
        self.kwargs = kwargs
        if 'code' not in self.kwargs:
            try:
                self.kwargs['code'] = self.code
            except AttributeError:
                pass
        if message:
            self.message = message

        try:
            self.message = self.message % kwargs
        except Exception as e:
            raise e
        super(VitMeetsException, self).__init__(self.message)


class NotFound(VitMeetsException):
    code = 404

    def __init__(self, resource, name):
        self.message = "No {} found with name: '{}'" \
            .format(resource.title(), name)


class AlreadyExists(VitMeetsException):
    code = 409

    def __init__(self, resource):
        self.message = "{} already exists".format(resource.title())


class InvalidCredentials(VitMeetsException):
    code = 401

    def __init__(self):
        self.message = "Invalid credentials! Incorrect email or password"


class DBError(VitMeetsException):
    code = 500

    def __init__(self):
        self.message = "Database error, please contact administrator!"

